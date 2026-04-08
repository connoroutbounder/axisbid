'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PartSpecsFormProps {
  onSubmit: (specs: PartSpecs) => void
}

export interface PartSpecs {
  material: string
  surfaceFinish: string
  tolerance: 'standard' | 'precision' | 'ultra'
  quantity: number
  neededByDate: string
  notes: string
}

const materials = [
  {
    category: 'Aluminum',
    options: [
      { value: 'al-6061', label: '6061' },
      { value: 'al-7075', label: '7075' },
    ],
  },
  {
    category: 'Steel',
    options: [
      { value: 'steel-mild', label: 'Mild Steel' },
      { value: 'steel-4140', label: '4140' },
      { value: 'steel-tool', label: 'Tool Steel' },
    ],
  },
  {
    category: 'Stainless',
    options: [
      { value: 'ss-304', label: '304' },
      { value: 'ss-316', label: '316' },
    ],
  },
  {
    category: 'Exotic',
    options: [
      { value: 'exotic-ti5', label: 'Titanium Gr5' },
      { value: 'exotic-inconel', label: 'Inconel' },
    ],
  },
  {
    category: 'Plastic',
    options: [
      { value: 'plastic-delrin', label: 'Delrin' },
      { value: 'plastic-peek', label: 'PEEK' },
      { value: 'plastic-nylon', label: 'Nylon' },
    ],
  },
]

const surfaceFinishes = [
  { value: 'as-machined', label: 'As Machined' },
  { value: 'polished', label: 'Polished' },
  { value: 'anodized', label: 'Anodized' },
  { value: 'powder-coat', label: 'Powder Coat' },
  { value: 'plated', label: 'Plated' },
]

export function PartSpecsForm({ onSubmit }: PartSpecsFormProps) {
  const [formData, setFormData] = useState<PartSpecs>({
    material: '',
    surfaceFinish: '',
    tolerance: 'standard',
    quantity: 1,
    neededByDate: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-6 text-gray-900">Part Specifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Material */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material *
            </label>
            <div className="space-y-2">
              {materials.map((group) => (
                <div key={group.category}>
                  <optgroup
                    label={group.category}
                    className="bg-gray-100 text-gray-700"
                  />
                  {group.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="material"
                        value={option.value}
                        checked={formData.material === option.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            material: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-brand-blue"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {group.category} - {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Surface Finish */}
          <Select
            label="Surface Finish *"
            options={surfaceFinishes}
            value={formData.surfaceFinish}
            onChange={(e) =>
              setFormData({
                ...formData,
                surfaceFinish: e.target.value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Tolerance */}
          <Select
            label="Tolerance *"
            value={formData.tolerance}
            onChange={(e) =>
              setFormData({
                ...formData,
                tolerance: e.target.value as PartSpecs['tolerance'],
              })
            }
          >
            <option value="standard">Standard (±0.005&quot;)</option>
            <option value="precision">Precision (±0.0005&quot;)</option>
            <option value="ultra">Ultra Precision (±0.0001&quot;)</option>
          </Select>

          {/* Quantity */}
          <Input
            label="Quantity *"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>

        <div className="mb-6">
          {/* Needed By Date */}
          <Input
            label="Needed By Date *"
            type="date"
            value={formData.neededByDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                neededByDate: e.target.value,
              })
            }
          />
        </div>

        <div>
          {/* Notes */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({
                ...formData,
                notes: e.target.value,
              })
            }
            placeholder="e.g., Special requirements, threading, specific operations, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue focus:ring-opacity-20 focus:outline-none"
            rows={4}
          />
        </div>

        <div className="pt-4">
          <Button type="submit" variant="primary" className="w-full">
            Continue to Review
          </Button>
        </div>
      </Card>
    </form>
  )
}
