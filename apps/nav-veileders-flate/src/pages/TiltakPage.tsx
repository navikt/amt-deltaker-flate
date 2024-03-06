import { DeltakerInfo } from '../components/tiltak/DeltakerInfo.tsx'
import { ForNAVAnsatt } from '../components/tiltak/ForNAVAnsatt.tsx'

export const TiltakPage = () => {
  return (
    <div className="flex flex-col gap-4 xl:flex-row-reverse">
      <ForNAVAnsatt className="w-fit xl:grow" />
      <DeltakerInfo className="w-full xl:w-[65%]" />
    </div>
  )
}
