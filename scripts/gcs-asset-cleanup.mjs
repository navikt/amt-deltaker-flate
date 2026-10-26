import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import process from 'node:process'

export function findAssetCandidates(
  listing,
  bucket,
  buildDirectory,
  now,
  retentionDays
) {
  const prefix = `${bucket}/assets/`
  const cutoff = now - retentionDays * 24 * 60 * 60 * 1000
  const candidates = []

  for (const line of listing.split('\n')) {
    if (!line.trim() || /^\s*TOTAL:/.test(line)) continue

    const match = line.match(/^\s*\d+\s+(\S+)\s+(gs:\/\/\S+)\s*$/)
    if (!match || !match[2].startsWith(prefix)) {
      throw new Error(`Unexpected asset listing: ${line}`)
    }

    const [, timestamp, url] = match
    const name = url.slice(bucket.length + 1)
    if (
      !/^assets\/[a-zA-Z0-9._/-]+$/.test(name) ||
      name
        .split('/')
        .some((part) => part === '.' || part === '..' || part === '')
    ) {
      throw new Error(`Unexpected asset name: ${name}`)
    }

    const createdAt = Date.parse(timestamp)
    if (!Number.isFinite(createdAt)) {
      throw new Error(`Invalid asset timestamp: ${timestamp}`)
    }

    if (createdAt < cutoff && !existsSync(resolve(buildDirectory, name))) {
      candidates.push(url)
    }
  }

  return candidates
}

export function deleteAssetCandidates(candidates, run = spawnSync) {
  if (candidates.length === 0) return

  const result = run('gsutil', ['-m', 'rm', '-I'], {
    input: `${candidates.join('\n')}\n`,
    stdio: ['pipe', 'inherit', 'inherit'],
    encoding: 'utf8'
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`Failed to delete assets (exit ${result.status})`)
  }
}

export function isAllowedAssetBase(bucket, retentionDays) {
  const cdnPath = (bucket ?? '').match(
    /^gs:\/\/nais-cdn-nav-amt-[a-f0-9]{4}\/amt\/amt-[a-z0-9-]+-(dev|prod)\/build$/
  )
  if (retentionDays === 0) return cdnPath?.[1] === 'dev'
  return (
    /^gs:\/\/[a-z0-9][a-z0-9._-]*$/.test(bucket ?? '') ||
    cdnPath?.[1] === 'prod'
  )
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const bucket = process.env.BUCKET
  const retentionDays = Number(process.env.RETENTION_DAYS)
  const deleteAssets = process.argv[2] === '--delete'
  if (process.argv.length > (deleteAssets ? 3 : 2)) {
    throw new Error('Unexpected cleanup arguments')
  }
  if (
    !isAllowedAssetBase(bucket, retentionDays) ||
    !Number.isSafeInteger(retentionDays) ||
    retentionDays < 0
  ) {
    throw new Error('Invalid bucket or retention period')
  }
  if (!statSync('build/assets').isDirectory()) {
    throw new Error('Missing build/assets directory')
  }

  const candidates = findAssetCandidates(
    readFileSync(0, 'utf8'),
    bucket,
    'build',
    Date.now(),
    retentionDays
  )
  const description =
    retentionDays === 0
      ? 'CDN dev assets absent from the current build'
      : `production assets older than ${retentionDays} days`
  if (deleteAssets) {
    deleteAssetCandidates(candidates)
    process.stdout.write(`Deleted ${candidates.length} ${description}\n`)
  } else {
    for (const url of candidates) process.stdout.write(`Would remove ${url}\n`)
    process.stdout.write(
      `${candidates.length} ${description} are eligible for cleanup (dry run only)\n`
    )
  }
}
