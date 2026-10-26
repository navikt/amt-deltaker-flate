import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { PassThrough } from 'node:stream'
import { setImmediate } from 'node:timers'
import {
  deleteAssetCandidates,
  findAssetCandidates,
  isAllowedAssetBase,
  readAssetListing
} from './gcs-asset-cleanup.mjs'

const bucket = 'gs://app-prod'
const now = Date.parse('2026-10-26T12:00:00Z')
const build = mkdtempSync(join(tmpdir(), 'gcs-prod-assets-'))

try {
  mkdirSync(join(build, 'assets'))
  writeFileSync(join(build, 'assets', 'current.js'), '')

  const listing = [
    `  1  2026-10-01T10:00:00Z  ${bucket}/assets/old.js`,
    `  1  2026-10-01T10:00:00Z  ${bucket}/assets/current.js`,
    `  1  2026-10-25T10:00:00Z  ${bucket}/assets/recent.js`,
    `  1  2026-10-19T12:00:00Z  ${bucket}/assets/boundary.js`,
    'TOTAL: 4 objects, 4 bytes'
  ].join('\n')

  const delayedInput = new PassThrough()
  const readResult = readAssetListing(delayedInput)
  setImmediate(() => delayedInput.end(listing))
  assert.equal(await readResult, listing)

  const failedInput = new PassThrough()
  const failedRead = readAssetListing(failedInput)
  setImmediate(() => failedInput.destroy(new Error('listing failed')))
  await assert.rejects(failedRead, /listing failed/)

  const candidates = findAssetCandidates(listing, bucket, build, now, 7)
  assert.deepEqual(candidates, [`${bucket}/assets/old.js`])
  const cdnBase = 'gs://nais-cdn-nav-amt-abcd/amt/amt-veileder-flate-prod/build'
  const cdnDev = 'gs://nais-cdn-nav-amt-abcd/amt/amt-veileder-flate-dev/build'
  assert.equal(isAllowedAssetBase(cdnBase, 7), true)
  assert.equal(isAllowedAssetBase(cdnBase, 0), false)
  assert.equal(isAllowedAssetBase(cdnDev, 0), true)
  assert.equal(isAllowedAssetBase(cdnDev, 7), false)
  assert.equal(isAllowedAssetBase(bucket, 0), false)
  assert.equal(isAllowedAssetBase(`${cdnBase}/assets`, 7), false)
  assert.equal(isAllowedAssetBase('gs://nais-cdn-nav-amt-abcd/amt', 7), false)
  assert.equal(
    isAllowedAssetBase(
      'gs://nais-cdn-nav-amt-abcd/amt/amt-veileder-flate-demo/build',
      0
    ),
    false
  )
  assert.deepEqual(
    findAssetCandidates(
      `  1  2026-10-01T10:00:00Z  ${cdnBase}/assets/old.js`,
      cdnBase,
      build,
      now,
      7
    ),
    [`${cdnBase}/assets/old.js`]
  )
  assert.deepEqual(
    findAssetCandidates(
      [
        `  1  2026-10-25T10:00:00Z  ${cdnDev}/assets/recent.js`,
        `  1  2026-10-25T10:00:00Z  ${cdnDev}/assets/current.js`
      ].join('\n'),
      cdnDev,
      build,
      now,
      0
    ),
    [`${cdnDev}/assets/recent.js`]
  )
  assert.throws(
    () =>
      findAssetCandidates(
        `  1  2026-10-01T10:00:00Z  ${bucket}/pr-1441/index.html`,
        bucket,
        build,
        now,
        7
      ),
    /Unexpected asset listing/
  )
  assert.throws(
    () =>
      findAssetCandidates(
        `  1  2026-10-01T10:00:00Z  ${bucket}/assets/../index.html`,
        bucket,
        build,
        now,
        7
      ),
    /Unexpected asset name/
  )

  let command
  deleteAssetCandidates(candidates, (...args) => {
    command = args
    return { status: 0 }
  })
  assert.equal(command[0], 'gsutil')
  assert.deepEqual(command[1], ['-m', 'rm', '-I'])
  assert.equal(command[2].input, `${bucket}/assets/old.js\n`)

  deleteAssetCandidates([], () => {
    throw new Error('Empty candidate list must not trigger deletion')
  })
  assert.throws(
    () => deleteAssetCandidates(candidates, () => ({ status: 1 })),
    /Failed to delete assets/
  )
} finally {
  rmSync(build, { recursive: true, force: true })
}
