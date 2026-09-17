import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Numbered process steps — the order is real, so the numbers carry meaning. */
export function StepIndicator({ steps, currentStep }) {
  return (
    <ol className="grid grid-cols-2 sm:grid-cols-4 panel overflow-hidden mb-6 list-none m-0 p-0">
      {steps.map((step, i) => {
        const stepNum = i + 1
        const isCompleted = currentStep > stepNum
        const isActive = currentStep === stepNum
        return (
          <li
            key={step}
            aria-current={isActive ? 'step' : undefined}
            className={cn(
              'relative flex items-center gap-2.5 px-4 py-3 border-[var(--border)]',
              'sm:border-r last:border-r-0 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0',
              isActive && 'bg-[var(--accent-bg)]'
            )}
          >
            <span
              className={cn(
                'w-6 h-6 rounded-[6px] flex items-center justify-center font-mono text-[11px] font-medium border flex-shrink-0',
                isCompleted ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : isActive ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border-2)] text-[var(--text-4)]'
              )}
            >
              {isCompleted ? <Check size={13} /> : String(stepNum).padStart(2, '0')}
            </span>
            <span className={cn('text-xs font-medium', isActive ? 'text-[var(--text)]' : isCompleted ? 'text-[var(--text-2)]' : 'text-[var(--text-4)]')}>{step}</span>
            {isActive && <span aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-[2px] bg-[var(--accent)]" />}
          </li>
        )
      })}
    </ol>
  )
}
