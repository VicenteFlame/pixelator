interface SliderProps {
    value: number[]
    onValueChange: (value: number[]) => void
    min?: number
    max?: number
    step?: number
    id?: string
    className?: string
  }
  
  const Slider = ({ value, onValueChange, ...props }: SliderProps) => {
    return (
      <input
        type="range"
        {...props}
        value={value[0]}
        onChange={(e) => onValueChange([parseInt(e.target.value)])}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    )
  }
  
  export { Slider }