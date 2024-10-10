// FormComponents.tsx
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  required?: boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  required = false,
  ...props
}) => (
  <div>
    <label
      htmlFor={props.id}
      className="block text-sm font-medium text-gray-700"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${props.className}`}
    />
  </div>
)

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  required?: boolean
  options: { value: string; label: string }[]
}

export const Select: React.FC<SelectProps> = ({
  label,
  required = false,
  options,
  ...props
}) => (
  <div>
    <label
      htmlFor={props.id}
      className="block text-sm font-medium text-gray-700"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      className={`mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${props.className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)
