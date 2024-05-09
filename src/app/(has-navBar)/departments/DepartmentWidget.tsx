"use client"

import { AddDepartmentDialog } from "@/components/AddDepartmentDialog"
import { DepartmentComp } from "@/components/Department"
import { ArrowLeftSvg, ArrowRightSvg, CaretDownSvg } from "@/components/Svg"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Department } from "@prisma/client"

interface DepartmentProps {
  companyId: string
  departments: Department[]
}
const DepartmentsWidget = ({ companyId, departments }: DepartmentProps) => {
  return (
    <section className="mx-[85.5px] space-y-10">
      <div className="p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
            Department
          </h1>

          <AddDepartmentDialog companyId={companyId} />
        </div>

        {departments.length > 0 ? (
          <div className="space-y-4">
            {departments.map((d) => (
              <DepartmentComp key={d.id} name={d.name} />
            ))}
          </div>
        ) : (
          <p>No Department yet</p>
        )}
      </div>

      <div className="p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
            UI/UX Design Department
          </h1>
        </div>
        <div>
          <Table className="w-full">
            <TableHeader className="w-full">
              <TableRow className="text-[#475467] text-[14px] font-normal leading-5">
                <TableHead>Name</TableHead>
                <TableHead>JoinDate</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone number</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="w-full">
              <TableRow className=" text-[#475467] text-[14px] font-normal leading-5">
                <TableCell className="flex items-center space-x-4">
                  <span className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white bg-[#006A86]">
                      K
                    </span>
                    <p className="text-[#475467] text-[14px] font-normal leading-5">
                      Karigirwa
                    </p>
                  </span>
                  <p className="text-[14px] font-bold">Manager</p>
                </TableCell>
                <TableCell>Sept 3,23</TableCell>
                <TableCell>paccy@email.com</TableCell>
                <TableCell className="">0786452332</TableCell>
                <TableCell>
                  <CaretDownSvg />
                </TableCell>
              </TableRow>
              <TableRow className=" text-[#475467] text-[14px] font-normal leading-5">
                <TableCell className="flex items-center space-x-4">
                  <span className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white bg-[#006A86]">
                      K
                    </span>
                    <p className="text-[#475467] text-[14px] font-normal leading-5">
                      Karigirwa
                    </p>
                  </span>
                </TableCell>
                <TableCell>Sept 3,23</TableCell>
                <TableCell>paccy@email.com</TableCell>
                <TableCell className="">0786452332</TableCell>
                <TableCell>
                  <CaretDownSvg />
                </TableCell>
              </TableRow>
              <TableRow className=" text-[#475467] text-[14px] font-normal leading-5">
                <TableCell className="flex items-center space-x-4">
                  <span className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white bg-[#006A86]">
                      K
                    </span>
                    <p className="text-[#475467] text-[14px] font-normal leading-5">
                      Karigirwa
                    </p>
                  </span>
                </TableCell>
                <TableCell>Sept 3,23</TableCell>
                <TableCell>paccy@email.com</TableCell>
                <TableCell className="">0786452332</TableCell>
                <TableCell>
                  <CaretDownSvg />
                </TableCell>
              </TableRow>
              <TableRow className=" text-[#475467] text-[14px] font-normal leading-5">
                <TableCell className="flex items-center space-x-4">
                  <span className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white bg-[#006A86]">
                      K
                    </span>
                    <p className="text-[#475467] text-[14px] font-normal leading-5">
                      Karigirwa
                    </p>
                  </span>
                </TableCell>
                <TableCell>Sept 3,23</TableCell>
                <TableCell>paccy@email.com</TableCell>
                <TableCell className="">0786452332</TableCell>
                <TableCell>
                  <CaretDownSvg />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="w-full border-[#EAECF0] border-[1px] flex items-center justify-between pt-[10px] pb-[13px] rounded-b-md px-5">
            <Button
              className="flex items-center gap-[6.5px] border-[0.823px] border-[#EAECF0] rounded-[6.5px] px-[11.5px] py-[4px] text-[11.4px] text-[#344054] font-semibold leading-[16.462px] cursor-pointer bg-white hover:bg-white/80"
              text="Preview"
              position="left"
              svg={<ArrowLeftSvg />}
              disabled={true}
              // onClick={previousHandle}
            />
            <Button
              className={cn(
                "flex items-center gap-[6.5px] border-[0.823px] border-[#EAECF0] rounded-[6.5px] px-[11.5px] py-[4px] text-[11.4px] text-[#344054] font-semibold leading-[16.462px] cursor-pointer bg-white hover:bg-white/80"
              )}
              text="Next"
              svg={<ArrowRightSvg />}
              // disabled={isLastPage}
              // onClick={nextHandle}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default DepartmentsWidget
