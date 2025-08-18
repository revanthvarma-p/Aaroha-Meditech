import React from "react"
import { motion } from "framer-motion"

export const MotionFadeIn: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
}> = ({ children, className = "", delay = 0.3 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ delay, duration: 0.8, ease: "easeInOut" }}
    viewport={{ once: true }}
    className={className}
  >
    {children}
  </motion.div>
)
