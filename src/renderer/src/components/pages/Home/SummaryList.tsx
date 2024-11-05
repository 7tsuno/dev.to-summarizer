// components/SummaryList.tsx
import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '../../ui/button'

type SummaryListProps = {
  summaries: Array<{ executedAt: string; tag: string; count: number; range: number }>
  onSummaryClick: (item: SummaryItem) => void
  limit?: number
  onViewMore?: () => void
}

type SummaryItem = {
  executedAt: string
  tag: string
  count: number
  range: number
}

const SummaryList: React.FC<SummaryListProps> = ({
  summaries,
  onSummaryClick,
  limit,
  onViewMore
}) => {
  const summariesToShow = limit ? summaries.slice(0, limit) : summaries

  return (
    <div>
      <ul className="space-y-3">
        {summariesToShow.map((summary, index) => (
          <li key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
            <a
              href="#"
              className="block hover:bg-muted p-2 rounded transition-colors"
              onClick={(e) => {
                e.preventDefault()
                onSummaryClick(summary)
              }}
            >
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(summary.executedAt).toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
              <div className="mt-2 text-xs">
                <p>
                  <span className="font-semibold">タグ:</span> {summary.tag}
                </p>
                <p>
                  <span className="font-semibold">件数:</span> {summary.count}件
                </p>
                <p>
                  <span className="font-semibold">期間:</span> {summary.range}日間
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      {onViewMore && summaries.length > (limit || 0) && (
        <Button variant="link" className="mt-2 w-full" onClick={onViewMore}>
          もっと見る
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default SummaryList
