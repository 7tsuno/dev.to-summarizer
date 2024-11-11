import * as React from 'react'
import { Button } from './button'

const AlertDialogContext = React.createContext<{
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}>({})

interface AlertDialogProps {
  children: React.ReactNode
}

interface AlertDialogTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

interface AlertDialogContentProps {
  children: React.ReactNode
}

interface AlertDialogHeaderProps {
  children: React.ReactNode
}

interface AlertDialogFooterProps {
  children: React.ReactNode
}

interface AlertDialogTitleProps {
  children: React.ReactNode
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode
}

interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <AlertDialogContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">{children}</div>
    </AlertDialogContext.Provider>
  )
}

export const AlertDialogTrigger: React.FC<AlertDialogTriggerProps> = ({ children, asChild }) => {
  const { setIsOpen } = React.useContext(AlertDialogContext)
  const handleClick = (): void => setIsOpen?.(true)

  return (
    <div onClick={handleClick} className={asChild ? '' : 'inline-block'}>
      {children}
    </div>
  )
}

export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ children }) => {
  const { isOpen } = React.useContext(AlertDialogContext)
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative bg-background p-6 rounded-lg shadow-lg w-full max-w-md border border-border">
        {children}
      </div>
    </div>
  )
}

export const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ children }) => {
  return <div className="mb-4">{children}</div>
}

export const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ children }) => {
  return <div className="flex justify-end space-x-2 mt-4">{children}</div>
}

export const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ children }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>
}

export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ children }) => {
  return <p className="text-sm text-muted-foreground mt-2">{children}</p>
}

export const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
  children,
  onClick,
  ...props
}) => {
  const { setIsOpen } = React.useContext(AlertDialogContext)
  return (
    <Button
      {...props}
      onClick={(e) => {
        onClick?.(e)
        setIsOpen?.(false)
      }}
    >
      {children}
    </Button>
  )
}

export const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ children, ...props }) => {
  const { setIsOpen } = React.useContext(AlertDialogContext)
  return (
    <Button {...props} variant="outline" onClick={() => setIsOpen?.(false)}>
      {children}
    </Button>
  )
}
