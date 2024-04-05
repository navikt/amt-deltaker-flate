import { DeltakerInfo } from '../components/tiltak/DeltakerInfo.tsx'
import { ForNAVAnsatt } from '../components/tiltak/ForNAVAnsatt.tsx'

export const TiltakPage = () => {
  return (
    <div className="flex flex-col gap-4 xl:flex-row-reverse ml-4 mr-4 xxl:ml-40 xxl:mr-40">
      <ForNAVAnsatt className="xl:w-fit" />
      <DeltakerInfo className="w-full xl:w-[65%]" />
    </div>
  )
}
