import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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
      name.split('/').some((part) => part === '.' || part === '..' || part === '')
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

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const bucket = process.env.BUCKET
  const retentionDays = Number(process.env.RETENTION_DAYS)
  if (
    !/^gs:\/\/[a-z0-9][a-z0-9._-]*$/.test(bucket ?? '') ||
    !Number.isSafeInteger(retentionDays) ||
    retentionDays <= 0
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
  for (const url of candidates) console.log(`Would remove ${url}`)
  console.log(
    `${candidates.length} production assets older than ${retentionDays} days are eligible for cleanup (dry run only)`
  )
}
