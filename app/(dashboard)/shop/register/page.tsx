'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Stepper } from '@/components/ui/stepper'
import { AlertCircle } from 'lucide-react'

const steps = [
  { label: 'Business Info', value: 'business' },
  { label: 'Machines', value: 'machines' },
  { label: 'Certifications', value: 'certs' },
]

interface ShopInfo {
  name: string
  address: string
  city: string
  state: string
  zip: string
  yearsInBusiness: number
  employees: number
}

interface Machine {
  type: string
  brand: string
  model: string
  axes: number
  maxTravel: string
}

interface CertData {
  iso9001: boolean
  as9100: boolean
  iso13485: boolean
  itar: boolean
  nadcap: boolean
}

export default function ShopRegisterPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [shopInfo, setShopInfo] = useState<ShopInfo>({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    yearsInBusiness: 0,
    employees: 0,
  })
  const [machines, setMachines] = useState<Machine[]>([])
  const [certs, setCerts] = useState<CertData>({
    iso9001: false,
    as9100: false,
    iso13485: false,
    itar: false,
    nadcap: false,
  })
  const [newMachine, setNewMachine] = useState<Machine>({
    type: '',
    brand: '',
    model: '',
    axes: 3,
    maxTravel: '',
  })

  const handleAddMachine = () => {
    if (newMachine.type && newMachine.brand && newMachine.model) {
      setMachines([...machines, newMachine])
      setNewMachine({
        type: '',
        brand: '',
        model: '',
        axes: 3,
        maxTravel: '',
      })
    }
  }

  const handleRemoveMachine = (idx: number) => {
    setMachines(machines.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    // API call will be made here
    console.log({ shopInfo, machines, certs })
  }

  return (
    <DashboardLayout userRole="shop">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Register Your Shop</h1>
          <p className="text-gray-600 mt-2">
            Complete your profile to start receiving bids
          </p>
        </div>

        <Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep} />

        {/* Step 1: Business Info */}
        {currentStep === 0 && (
          <Card>
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Business Information
            </h2>

            <div className="space-y-4 mb-8">
              <Input
                label="Shop Name *"
                value={shopInfo.name}
                onChange={(e) =>
                  setShopInfo({ ...shopInfo, name: e.target.value })
                }
                required
              />

              <Input
                label="Street Address *"
                value={shopInfo.address}
                onChange={(e) =>
                  setShopInfo({ ...shopInfo, address: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City *"
                  value={shopInfo.city}
                  onChange={(e) =>
                    setShopInfo({ ...shopInfo, city: e.target.value })
                  }
                  required
                />
                <Input
                  label="State *"
                  value={shopInfo.state}
                  onChange={(e) =>
                    setShopInfo({ ...shopInfo, state: e.target.value })
                  }
                  required
                />
              </div>

              <Input
                label="ZIP Code *"
                value={shopInfo.zip}
                onChange={(e) =>
                  setShopInfo({ ...shopInfo, zip: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Years in Business *"
                  type="number"
                  min="0"
                  value={shopInfo.yearsInBusiness}
                  onChange={(e) =>
                    setShopInfo({
                      ...shopInfo,
                      yearsInBusiness: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
                <Input
                  label="Number of Employees *"
                  type="number"
                  min="1"
                  value={shopInfo.employees}
                  onChange={(e) =>
                    setShopInfo({
                      ...shopInfo,
                      employees: parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" disabled>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(1)}
                disabled={!shopInfo.name || !shopInfo.address}
              >
                Next
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Machines */}
        {currentStep === 1 && (
          <Card>
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Your Machines
            </h2>

            {/* Add Machine Form */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Add a Machine</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Select
                  label="Machine Type *"
                  value={newMachine.type}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, type: e.target.value })
                  }
                  options={[
                    { value: '', label: 'Select machine type' },
                    { value: 'cnc-mill', label: 'CNC Mill' },
                    { value: 'cnc-lathe', label: 'CNC Lathe' },
                    { value: 'edm', label: 'EDM' },
                    { value: 'waterjet', label: 'Waterjet' },
                    { value: 'plasma', label: 'Plasma' },
                  ]}
                />
                <Input
                  label="Brand *"
                  value={newMachine.brand}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, brand: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  label="Model *"
                  value={newMachine.model}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, model: e.target.value })
                  }
                />
                <Input
                  label="Axes"
                  type="number"
                  value={newMachine.axes}
                  onChange={(e) =>
                    setNewMachine({
                      ...newMachine,
                      axes: parseInt(e.target.value) || 3,
                    })
                  }
                />
              </div>

              <Input
                label="Max Travel (e.g., 24x12x10)"
                value={newMachine.maxTravel}
                onChange={(e) =>
                  setNewMachine({ ...newMachine, maxTravel: e.target.value })
                }
              />

              <Button
                variant="secondary"
                onClick={handleAddMachine}
                className="w-full mt-4"
                disabled={!newMachine.type || !newMachine.brand || !newMachine.model}
              >
                Add Machine
              </Button>
            </div>

            {/* Machines List */}
            {machines.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Added Machines ({machines.length})
                </h3>
                <div className="space-y-3">
                  {machines.map((machine, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {machine.type} - {machine.brand} {machine.model}
                        </p>
                        <p className="text-sm text-gray-600">
                          {machine.axes} axis
                          {machine.maxTravel && ` • Max travel: ${machine.maxTravel}`}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveMachine(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(0)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(2)}
                disabled={machines.length === 0}
              >
                Next
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Certifications */}
        {currentStep === 2 && (
          <Card>
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Certifications & Materials
            </h2>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                What certifications do you have?
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'iso9001', label: 'ISO 9001 (Quality Management)' },
                  { key: 'as9100', label: 'AS9100 (Aerospace)' },
                  { key: 'iso13485', label: 'ISO 13485 (Medical Devices)' },
                  { key: 'itar', label: 'ITAR (Munitions & Defense)' },
                  { key: 'nadcap', label: 'NADCAP (Aerospace Suppliers)' },
                ].map((cert) => (
                  <label
                    key={cert.key}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={certs[cert.key as keyof CertData]}
                      onChange={(e) =>
                        setCerts({
                          ...certs,
                          [cert.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-brand-blue"
                    />
                    <span className="ml-3 font-medium text-gray-900">
                      {cert.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-brand-blue bg-opacity-10 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                You'll also need to connect your Stripe account to receive payments. This will be set up in the next step.
              </p>
            </div>

            <div className="flex justify-between gap-3 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
              >
                Complete Setup
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
