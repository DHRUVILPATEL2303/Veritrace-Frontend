import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * ScrollReveal — a quiet fade/rise as content enters the viewport.
 * Kept deliberately small: 10px of travel, no blur, no scale.
 */

const variants = {
  'fade-up': { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } },
  'fade-down': { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } },
  'fade-left': { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } },
  'fade-right': { hidden: { opacity: 0, x: 10 }, visible: { opacity: 1, x: 0 } },
  zoom: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  blur: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}

export function ScrollReveal({
  children,
  className,
  variant = 'fade-up',
  delay = 0,
  once = true,
  amount = 0.12,
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants[variant] || variants['fade-up']}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export function ScrollRevealGroup({ children, className, variant = 'fade-up', stagger = 0.08, once = true, ...props }) {
  const container = { hidden: {}, visible: { transition: { staggerChildren: stagger } } }
  const item = variants[variant] || variants['fade-up']

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once, amount: 0.1 }} variants={container} className={cn(className)} {...props}>
      {Array.isArray(children)
        ? children.map((child, i) => (
          <motion.div key={i} variants={item} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            {child}
          </motion.div>
        ))
        : children}
    </motion.div>
  )
}
