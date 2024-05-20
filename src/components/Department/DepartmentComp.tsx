"use client"

import { DirectionArrowRightSvg } from "../Svg"
import EditDepartment from "./EditDepartment"

interface DepartmentCompProps {
  name: string
  id: string
  onClickHandle: (id: string, name: string) => void
}

const DepartmentComp = ({ name, id, onClickHandle }: DepartmentCompProps) => {
  return (
    <>
      <div className="flex items-center justify-between space-x-4">
        <div
          className="flex flex-1 items-center justify-between p-4 bg-white rounded-[24px] cursor-pointer"
          onClick={() => onClickHandle(id, name)}
        >
          <p className="font-medium leading-6">{name} Department</p>
          <DirectionArrowRightSvg />
        </div>
        <EditDepartment id={id} name={name} />
      </div>
    </>
  )
}

export default DepartmentComp
