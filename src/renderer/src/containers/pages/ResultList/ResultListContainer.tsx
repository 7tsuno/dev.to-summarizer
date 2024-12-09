// containers/ResultListContainer.tsx
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useBlogList } from './hooks/useBlogList'
import { useArticleSelection } from './hooks/useArticleSelection'
import { useSummaryManagement } from './hooks/useSummaryManagement'
import ResultListComponent from '@renderer/components/pages/ResultList/ResultListComponent'

const ResultListContainer: React.FC = () => {
  const location = useLocation()
  const navigagte = useNavigate()
  const state = location.state as { tag: string; count: string; range: string; executedAt: Date }

  const { blogList, setBlogList } = useBlogList({ executedAt: state.executedAt })
  const { selectedArticles, toggleArticleSelection, toggleSelectAll } = useArticleSelection()
  const { expandedSummaries, toggleSummary, checkSummarized, translateAndSummarize, isLoading } =
    useSummaryManagement(blogList, setBlogList)

  return (
    <ResultListComponent
      navigate={navigagte}
      blogList={blogList}
      selectedArticles={selectedArticles}
      expandedSummaries={expandedSummaries}
      state={state}
      onArticleSelect={toggleArticleSelection}
      onTranslateAndSummarize={() => translateAndSummarize(selectedArticles)}
      onCheckSummarized={checkSummarized}
      onToggleSummary={toggleSummary}
      onToggleSelectAll={() => toggleSelectAll(blogList)}
      isLoading={isLoading}
    />
  )
}

export default ResultListContainer
