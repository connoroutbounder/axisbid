'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  label: string
  value: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepChange?: (step: number) => void
  className?: string
}

export function Stepper({
  steps,
  currentStep,
  onStepChange,
  className,
}: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.value} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <button
                onClick={() => onStepChange?.(index)}
                className={cn(
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-colors',
                  currentStep > index
                    ? 'bg-brand-green border-brand-green text-white'
                    : currentStep === index
                      ? 'bg-brand-blue border-brand-blue text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                )}
              >
                {currentStep > index ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              <p
                className={cn(
                  'text-xs font-medium mt-2 text-center',
                  currentStep >= index ? 'text-gray-900' : 'text-gray-500'
                )}
              >
                {step.label}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 mt-5',
                  currentStep > index
                    ? 'bg-brand-green'
                    : 'bg-gray-300'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
