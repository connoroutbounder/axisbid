'use client'

interface MaterialSelectorProps {
  value: string
  onChange: (value: string) => void
}

const materials = [
  { id: 'al6061', name: 'Aluminum 6061', category: 'Aluminum' },
  { id: 'al7075', name: 'Aluminum 7075', category: 'Aluminum' },
  { id: 'ss304', name: 'Stainless 304', category: 'Stainless Steel' },
  { id: 'ss316', name: 'Stainless 316', category: 'Stainless Steel' },
  { id: 'mild', name: 'Mild Steel', category: 'Steel' },
  { id: 'tool', name: 'Tool Steel', category: 'Steel' },
  { id: 'ti', name: 'Titanium Grade 5', category: 'Titanium' },
  { id: 'delrin', name: 'Delrin', category: 'Plastic' },
  { id: 'peek', name: 'PEEK', category: 'Plastic' },
  { id: 'nylon', name: 'Nylon', category: 'Plastic' },
]

const grouped = materials.reduce((acc, mat) => {
  if (!acc[mat.category]) acc[mat.category] = []
  acc[mat.category].push(mat)
  return acc
}, {} as Record<string, typeof materials>)

export default function MaterialSelector({ value, onChange }: MaterialSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Material
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:border-transparent"
      >
        <option value="">Select a material...</option>
        {Object.entries(grouped).map(([category, mats]) => (
          <optgroup key={category} label={category}>
            {mats.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
