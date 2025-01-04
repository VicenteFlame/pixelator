interface LabelProps {
    children: React.ReactNode
    htmlFor?: string
    className?: string
  }
  
  const Label = ({ children, ...props }: LabelProps) => {
    return (
      <label {...props} className="text-sm font-medium text-gray-700">
        {children}
      </label>
    )
  }
  
  export { Label }
