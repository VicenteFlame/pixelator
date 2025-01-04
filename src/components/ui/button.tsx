import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
    >
      {children}
    </button>
  )
}

export { Button }