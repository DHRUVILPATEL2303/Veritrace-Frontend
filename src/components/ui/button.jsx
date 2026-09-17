import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn-primary',
      accent: 'btn-accent',
      success: 'btn-accent',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      danger: 'btn-danger',
      glass: 'btn-outline',
    },
    size: {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2.5',
      lg: 'text-[15px] px-5 py-3',
      icon: 'p-2',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export const Button = forwardRef(({ className, variant, size, as: Tag = 'button', ...props }, ref) => {
  return <Tag ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
})
Button.displayName = 'Button'
