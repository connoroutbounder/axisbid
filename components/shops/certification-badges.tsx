import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Award } from 'lucide-react'

interface CertificationBadgesProps {
  certifications: string[]
}

export function CertificationBadges({
  certifications,
}: CertificationBadgesProps) {
  if (certifications.length === 0) {
    return null
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-brand-orange" />
        <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {certifications.map((cert, idx) => (
          <Badge key={idx} variant="success">
            {cert}
          </Badge>
        ))}
      </div>
    </Card>
  )
}
