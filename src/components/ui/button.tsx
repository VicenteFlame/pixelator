import { ButtonHTMLAttributes } from 'react'
import { cn } from "../../lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center px-4 py-2 text-white rounded-md",
        className
      )}
    >
      {children}
    </button>
  )
}

export { Button }