import React from 'react'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react'
import MainTemplate from '@renderer/components/template/MainTemplate'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'

type HistoryComponentProps = {
  history: Array<{
    executedAt: string
    tag: string
    count: number
    range: number
  }>
  onHistoryClick: (item: { executedAt: string; tag: string; count: number; range: number }) => void
  navigate: (path: string) => void
  onDeleteHistory: (executedAt: string) => void
}

const HistoryComponent: React.FC<HistoryComponentProps> = ({
  history,
  onHistoryClick,
  navigate,
  onDeleteHistory
}) => {
  return (
    <MainTemplate>
      <main className="flex-grow container mx-auto p-4">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-2xl">履歴一覧</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="divide-y divide-border">
                {history.map((item, index) => (
                  <li key={index} className="py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => onHistoryClick(item)}>
                        <div className="flex items-center space-x-6">
                          <p className="text-sm text-muted-foreground min-w-[180px]">
                            {new Date(item.executedAt).toLocaleString('ja-JP', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">タグ:</span>
                              <span className="text-sm">{item.tag}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">取得件数:</span>
                              <span className="text-sm">{item.count}件</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">期間:</span>
                              <span className="text-sm">{item.range}日間</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-4 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>履歴の削除</AlertDialogTitle>
                            <AlertDialogDescription>
                              この履歴を削除してもよろしいですか？この操作は取り消せません。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteHistory(item.executedAt)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              削除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </MainTemplate>
  )
}

export default HistoryComponent
