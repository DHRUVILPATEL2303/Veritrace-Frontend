import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function PageHero({ eyebrow = 'VERITRACE PROTOCOL', title, description, icon: Icon, children, className }) {
  return (
    <section className={cn('page-hero', className)}>
      <div className="max-w-[1280px] mx-auto px-5 py-6 md:py-8">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div className="max-w-3xl">
              <div className="kicker kicker-accent mb-2.5">
                {Icon && <Icon size={13} aria-hidden="true" />}
                {eyebrow}
              </div>
              <h1 className="page-title">{title}</h1>
              {description && <p className="page-description">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
