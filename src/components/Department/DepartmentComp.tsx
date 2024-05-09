"use client"

import { DirectionArrowRightSvg, ThreeDotsSvg } from "../Svg"

interface DepartmentCompProps {
  name: string
}

const DepartmentComp = ({ name }: DepartmentCompProps) => {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex flex-1 items-center justify-between p-4 bg-white rounded-[24px] cursor-pointer">
        <p className="font-medium leading-6">{name} Department</p>
        <DirectionArrowRightSvg />
      </div>
      <div
        className="flex items-center justify-center w-[36px] h-[36px] rounded-full cursor-pointer"
        style={{
          border: " 1px solid #CDDFE9"
        }}
      >
        <ThreeDotsSvg />
      </div>
    </div>
  )
}

export default DepartmentComp
