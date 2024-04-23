"use client"

import { useState } from "react"
import { CloseSvg, SearchSvg } from "../Svg"

const Search = () => {
  const [value, setValue] = useState<string>("")
  return (
    <div
      className="flex items-center justify-between p-2 w-[356px]"
      style={{
        borderRadius: "32px",
        border: "1px solid #E3F0F3",

        background: "var(--gray-white, #FFF)"
      }}
    >
      <SearchSvg />
      <input
        type="text"
        className="flex flex-1 px-4  outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <CloseSvg onClick={() => setValue("")} className="cursor-pointer" />
    </div>
  )
}

export default Search
