interface DescriptionProps {
  svg: React.ReactNode
  header: string
  description: string
}

const Description = ({ description, header, svg }: DescriptionProps) => {
  return (
    <div className="py-6 px-4 bg-white rounded-[32px] space-y-4">
      {svg}
      <div className="space-y-px text-left">
        <h4 className="text-[20px] font-lexend">{header}</h4>
        <p className="font-light leading-6 text-black">{description}</p>
      </div>
    </div>
  )
}

export default Description
