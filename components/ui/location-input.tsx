'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { MapPin } from 'lucide-react'

interface LocationData {
  city: string
  state: string
  zipCode: string
}

interface LocationInputProps {
  value: LocationData
  onChange: (data: LocationData) => void
}

export function LocationInput({ value, onChange }: LocationInputProps) {
  const [zipInput, setZipInput] = useState(value.zipCode)
  const [looking, setLooking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (zipInput.length !== 5) {
      setError('')
      return
    }

    const lookup = async () => {
      setLooking(true)
      setError('')
      try {
        const res = await fetch(`/api/location?zip=${zipInput}`)
        if (!res.ok) {
          setError('Zip code not found')
          onChange({ city: '', state: '', zipCode: zipInput })
          return
        }
        const data = await res.json()
        onChange({
          city: data.city,
          state: data.state,
          zipCode: zipInput,
        })
      } catch {
        setError('Lookup failed')
      } finally {
        setLooking(false)
      }
    }

    lookup()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipInput])

  return (
    <div className="space-y-3">
      <Input
        label="Zip Code *"
        type="text"
        inputMode="numeric"
        maxLength={5}
        placeholder="06510"
        value={zipInput}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '')
          setZipInput(val)
          if (val.length < 5) {
            onChange({ city: '', state: '', zipCode: val })
          }
        }}
        icon={<MapPin className="w-5 h-5" />}
        error={error}
        helperText={looking ? 'Looking up...' : undefined}
      />
      {value.city && value.state && (
        <div className="flex gap-3">
          <Input
            label="City"
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
          />
          <Input
            label="State"
            value={value.state}
            onChange={(e) => onChange({ ...value, state: e.target.value })}
            className="max-w-[80px]"
          />
        </div>
      )}
    </div>
  )
}
