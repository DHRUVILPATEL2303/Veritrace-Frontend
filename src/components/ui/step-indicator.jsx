import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center flex-wrap gap-0 mb-8">
      {steps.map((step, i) => {
        const stepNum = i + 1
        const isCompleted = currentStep > stepNum
        const isActive = currentStep === stepNum
        return (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2 px-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? 'rgba(0, 230, 118, 0.15)'
                    : isActive
                    ? 'rgba(59, 130, 246, 0.15)'
                    : 'rgba(30, 37, 54, 0.5)',
                  borderColor: isCompleted
                    ? 'rgba(0, 230, 118, 0.5)'
                    : isActive
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'rgba(30, 37, 54, 1)',
                }}
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                  isCompleted ? 'text-emerald-400' : isActive ? 'text-blue-400' : 'text-[var(--color-text-faint)]'
                )}
              >
                {isCompleted ? <Check size={14} /> : stepNum}
              </motion.div>
              <span className={cn(
                'text-xs font-semibold transition-colors duration-200',
                isCompleted ? 'text-emerald-400' : isActive ? 'text-blue-400' : 'text-[var(--color-text-faint)]'
              )}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                'w-8 h-0.5 rounded-full transition-colors duration-300',
                isCompleted ? 'bg-emerald-400/50' : 'bg-[var(--color-base-300)]'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}
