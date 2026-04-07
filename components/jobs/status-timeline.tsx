import { cn } from '@/lib/utils'
import { Check, Clock } from 'lucide-react'

interface TimelineStep {
  label: string
  status: 'completed' | 'current' | 'pending'
}

interface StatusTimelineProps {
  steps: TimelineStep[]
}

export function StatusTimeline({ steps }: StatusTimelineProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold transition-all',
                  step.status === 'completed'
                    ? 'bg-brand-green border-brand-green text-white'
                    : step.status === 'current'
                      ? 'bg-brand-blue border-brand-blue text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                )}
              >
                {step.status === 'completed' ? (
                  <Check className="w-6 h-6" />
                ) : step.status === 'current' ? (
                  <Clock className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <p
                className={cn(
                  'text-xs font-medium mt-3 text-center px-2 w-24',
                  step.status !== 'pending'
                    ? 'text-gray-900'
                    : 'text-gray-500'
                )}
              >
                {step.label}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-1 mx-2 mt-6',
                  step.status === 'completed'
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
