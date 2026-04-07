import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'

interface Machine {
  type: string
  brand: string
  model: string
  axes: number
  maxTravel: string
}

interface MachineListProps {
  machines: Machine[]
}

export function MachineList({ machines }: MachineListProps) {
  const machineTypeIcons: { [key: string]: string } = {
    'CNC Mill': '🏭',
    'CNC Lathe': '⚙️',
    'EDM': '⚡',
    'Waterjet': '💧',
    'Plasma': '🔥',
    '3D Printer': '🖨️',
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-brand-blue" />
        <h3 className="text-lg font-semibold text-gray-900">Capabilities</h3>
      </div>

      <div className="space-y-4">
        {machines.map((machine, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">
                    {machineTypeIcons[machine.type] || '🏭'}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {machine.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {machine.brand} {machine.model}
                    </p>
                  </div>
                </div>
              </div>
              <Badge variant="default">{machine.axes} Axis</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">
                  Max Travel
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {machine.maxTravel}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">
                  Configuration
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {machine.axes}-Axis
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
