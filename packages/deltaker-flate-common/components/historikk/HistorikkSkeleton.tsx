import { Skeleton } from '@navikt/ds-react'

export const HistorikkSkeleton = () => {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: '1.25rem auto'
      }}
    >
      <div className="mt-3 text-xl">
        <Skeleton variant="circle" width={16} height={16} />
      </div>

      <div>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton
          variant="rounded"
          width="100%"
          height={100}
          className="mt-2"
        />
      </div>
    </div>
  )
}
