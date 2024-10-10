// SubjectForm.tsx
'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { useState, useMemo } from 'react'
import { Input, Select } from '@/components/FormComponents' // Import reusable components
import { Button } from '@/components/Button'

interface Props {
  onSubmit: (subject: SubjectFormData) => void
  onCancel: () => void
}

type FormAssessment = Omit<Assessment, 'id'>

const SubjectForm: React.FC<Props> & { Modal: React.FC<ModalProps> } = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<SubjectFormData>({
    name: '',
    passingGrade: 50,
    bgColor: 'bg-gray-500',
    assessments: [],
    semester: '',
    credit: 12,
    included: true,
  })

  // Generate semesters dynamically
  const semesters = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1
    return [
      `${currentYear} First Semester`,
      `${currentYear} Second Semester`,
      `${nextYear} First Semester`,
      `${nextYear} Second Semester`,
    ]
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        value === ''
          ? value
          : name === 'passingGrade' || name === 'credit'
            ? Number(value)
            : name === 'included'
              ? value === 'yes'
              : value,
    }))
  }

  const handleAddAssessment = () => {
    setFormData((prev) => ({
      ...prev,
      assessments: [
        ...prev.assessments,
        {
          name: '',
          weight: 0,
          full_marks: 100,
          minimum_pass_requirement: 50,
          obtained_marks: 0,
        },
      ],
    }))
  }

  const handleAssessmentChange = (
    index: number,
    field: keyof FormAssessment,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const updatedAssessments = [...prev.assessments]
      updatedAssessments[index] = {
        ...updatedAssessments[index],
        [field]: field === 'name' ? value : Number(value),
      }
      return { ...prev, assessments: updatedAssessments }
    })
  }

  const handleRemoveAssessment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      assessments: prev.assessments.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-h-[75vh] space-y-4 overflow-scroll text-gray-700"
    >
      {/* Subject Name */}
      <Input
        label="Subject Name"
        name="name"
        id="name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />
      {/* Passing Grade */}
      <Input
        label="Passing Grade (%)"
        name="passingGrade"
        id="passingGrade"
        type="number"
        value={formData.passingGrade}
        onChange={handleInputChange}
        min="0"
        max="100"
        step="0.01"
        required
      />

      {/* todo: add background color (根据分数)*/}
      {/* Background Color */}
  

      {/* // 添加学分输入框 */}
      <Input
        label="Credit Points"
        name="credit"
        id="credit"
        type="number"
        value={formData.credit}
        onChange={handleInputChange}
        min="0"
        step="0.01"
        required
      />
      {/* // 添加是否包含在 WAM 计算中的选择框 */}
      <Select
        label="Include in WAM Calculation"
        name="included"
        id="included"
        value={formData.included ? 'yes' : 'no'}
        onChange={handleInputChange}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />
      {/* Semester */}
      <Select
        label="Semester"
        name="semester"
        id="semester"
        value={formData.semester}
        onChange={handleInputChange}
        options={[
          { value: '', label: 'Select Semester' },
          ...semesters.map((semester) => ({
            value: semester,
            label: semester,
          })),
        ]}
        required
      />
      {/* Assessments */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assessments
        </label>
        {formData.assessments.map((assessment, index) => (
          <AssessmentFields
            key={index}
            index={index}
            assessment={assessment}
            onChange={handleAssessmentChange}
            onRemove={handleRemoveAssessment}
          />
        ))}
        <Button type="button" onClick={handleAddAssessment} className="mt-4">
          Add Assessment
        </Button>
      </div>
      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (subject: SubjectFormData) => void
}

SubjectForm.Modal = function SubjectFormModal({
  isOpen,
  onClose,
  onSubmit,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-medium text-gray-900">
            Add New Subject
          </DialogTitle>
          <SubjectForm
            onSubmit={(subject) => {
              onSubmit(subject)
              onClose()
            }}
            onCancel={onClose}
          />
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default SubjectForm

// Define the missing AssessmentFieldsProps interface
interface AssessmentFieldsProps {
  index: number
  assessment: FormAssessment
  onChange: (
    index: number,
    field: keyof FormAssessment,
    value: string | number,
  ) => void
  onRemove: (index: number) => void
}

// Update AssessmentFields component
const AssessmentFields: React.FC<AssessmentFieldsProps> = ({
  index,
  assessment,
  onChange,
  onRemove,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormAssessment,
  ) => {
    const { value } = e.target
    const newValue =
      value === '' ? value : field === 'name' ? value : Number(value)
    onChange(index, field, newValue)
  }

  return (
    <div className="mt-2 space-y-2 rounded-md border bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Assessment {index + 1}
        </h4>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
      {/* Assessment Name */}
      <Input
        label="Name"
        id={`assessment-name-${index}`}
        value={assessment.name}
        onChange={(e) => handleInputChange(e, 'name')}
        required
      />
      {/* Weight */}
      <Input
        label="Weight (%)"
        id={`assessment-weight-${index}`}
        type="number"
        value={assessment.weight}
        onChange={(e) => handleInputChange(e, 'weight')}
        min="0"
        max="100"
        step="0.01"
        required
      />
      {/* Full Marks */}
      <Input
        label="Full Marks"
        id={`assessment-full_marks-${index}`}
        type="number"
        value={assessment.full_marks}
        onChange={(e) => handleInputChange(e, 'full_marks')}
        min="0"
        step="0.01"
        required
      />
      {/* Minimum Pass Requirement */}
      <Input
        label="Minimum Pass Requirement"
        id={`assessment-minimum_pass_requirement-${index}`}
        type="number"
        value={assessment.minimum_pass_requirement}
        onChange={(e) => handleInputChange(e, 'minimum_pass_requirement')}
        min="0"
        max={assessment.full_marks}
        step="0.01"
        required
      />
      {/* Obtained Marks */}
      <Input
        label="Obtained Marks"
        id={`assessment-obtained_marks-${index}`}
        type="number"
        value={assessment.obtained_marks}
        onChange={(e) => handleInputChange(e, 'obtained_marks')}
        min="0"
        max={assessment.full_marks}
        step="0.01"
      />
    </div>
  )
}
