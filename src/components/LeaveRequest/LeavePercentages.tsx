const LeavePercentages = () => {
  return (
    <div className="w-full p-4 rounded-[24px] bg-white space-y-[16px]">
      <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
        Percentage of requested leaves in year
      </h2>
      <div className="flex items-center  justify-between">
        <div className="border-[0.5px] border-[#CDDFE9] p-4 w-fit rounded-2xl">
          <span className="flex items-center space-x-8">
            <p className="text-[14px] leading-6 text-black">Approved</p>
            <p className="text-[24px] font-medium leading-6 text-black pr-[30px]">
              0.5%
            </p>
          </span>
        </div>
        <div className="border-[0.5px] border-[#CDDFE9] p-4 w-fit rounded-2xl">
          <span className="flex items-center space-x-8">
            <p className="text-[14px] leading-6 text-black">Requested</p>
            <p className="text-[24px] font-medium leading-6 text-black pr-[30px]">
              0.5%
            </p>
          </span>
        </div>
        <div className="border-[0.5px] border-[#CDDFE9] p-4 w-fit rounded-2xl">
          <span className="flex items-center space-x-8">
            <p className="text-[14px] leading-6 text-black">Declined</p>
            <p className="text-[24px] font-medium leading-6 text-black pr-[30px]">
              0.5%
            </p>
          </span>
        </div>
        <div className="border-[0.5px] border-[#CDDFE9] p-4 w-fit rounded-2xl">
          <span className="flex items-center space-x-8">
            <p className="text-[14px] leading-6 text-black">Pending</p>
            <p className="text-[24px] font-medium leading-6 text-black pr-[30px]">
              3%
            </p>
          </span>
        </div>
      </div>
    </div>
  )
}

export default LeavePercentages
