import { useState } from 'react'

const useValidatedInput = (initialValue: string, min: number, max: number) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (newValue === '' || (Number(newValue) >= 0 && Number(newValue) <= max)) {
      setValue(newValue)
    }
  }

  const handleBlur = () => {
    const numValue = Number(value)
    if (value === '') {
      setValue(min.toString())
      return
    }
    
    if (numValue < min) {
      setValue(min.toString())
    } else if (numValue > max) {
      setValue(max.toString())
    } else if (value !== '') {
      setValue(Math.round(numValue).toString())
    }
  }

  return [value, handleChange, handleBlur] as const
}

export default useValidatedInput
