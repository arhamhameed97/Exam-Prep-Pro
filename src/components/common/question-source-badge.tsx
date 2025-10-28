import { Sparkles, FileText } from "lucide-react"

interface QuestionSourceBadgeProps {
  source: 'ai' | 'past-paper'
  pastPaperMetadata?: {
    year: number
    month: string
    variant?: string
  }
}

export function QuestionSourceBadge({ source, pastPaperMetadata }: QuestionSourceBadgeProps) {
  if (source === 'past-paper' && pastPaperMetadata) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/30 text-xs font-medium">
        <FileText className="h-3 w-3 text-amber-600" />
        <span className="text-amber-700">
          Past Paper {pastPaperMetadata.month} {pastPaperMetadata.year}
          {pastPaperMetadata.variant && ` (Variant ${pastPaperMetadata.variant})`}
        </span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-400/30 text-xs font-medium">
      <Sparkles className="h-3 w-3 text-blue-600" />
      <span className="text-blue-700">AI Generated</span>
    </div>
  )
}

