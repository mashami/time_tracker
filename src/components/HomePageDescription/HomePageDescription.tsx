import { motion } from "framer-motion"
interface DescriptionProps {
  svg: React.ReactNode
  header: string
  description: string
}

const Description = ({ description, header, svg }: DescriptionProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      transition={{
        duration: 0.35,
        ease: "easeInOut"
      }}
      className="py-6 px-4 bg-white rounded-[32px] space-y-4 h-full"
    >
      {svg}
      <div className="space-y-px text-left">
        <h4 className="text-[20px] font-lexend">{header}</h4>
        <p className="font-light leading-6 text-black">{description}</p>
      </div>
    </motion.div>
  )
}

export default Description
