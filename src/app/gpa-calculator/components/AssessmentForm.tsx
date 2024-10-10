// AssessmentForm.tsx
'use client'

import React, { useState } from 'react'
import { Input } from '@/components/FormComponents'
import { Button } from '@/components/Button'

interface AssessmentFormProps {
  assessment?: Assessment
  onSave: (assessmentData: AssessmentInputData) => void
  onCancel: () => void
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  assessment,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<AssessmentInputData>({
    name: assessment?.name || '',
    weight: assessment?.weight || 0,
    full_marks: assessment?.full_marks || 100,
    minimum_pass_requirement: assessment?.minimum_pass_requirement || 50,
    obtained_marks: assessment?.obtained_marks || 0,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : value === '' ? value : Number(value),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
      {/* Name */}
      <Input
        label="Assessment Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      {/* Weight */}
      <Input
        label="Weight (%)"
        name="weight"
        type="number"
        value={formData.weight}
        onChange={handleChange}
        min="0"
        max="100"
        step="0.01"
        required
      />
      {/* Full Marks */}
      <Input
        label="Full Marks"
        name="full_marks"
        type="number"
        value={formData.full_marks}
        onChange={handleChange}
        min="0"
        step="0.01"
        required
      />
      {/* Minimum Pass Requirement */}
      <Input
        label="Minimum Pass Requirement"
        name="minimum_pass_requirement"
        type="number"
        value={formData.minimum_pass_requirement}
        onChange={handleChange}
        min="0"
        max={formData.full_marks}
        step="0.01"
        required
      />
      {/* Obtained Marks */}
      <Input
        label="Obtained Marks"
        name="obtained_marks"
        type="number"
        value={formData.obtained_marks}
        onChange={handleChange}
        min="0"
        max={formData.full_marks}
        step="0.01"
      />
      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
        >
          Cancel
        </button>
        <Button
          type="submit"
          className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium"
        >
          Save
        </Button>
      </div>
    </form>
  )
}

export default AssessmentForm
