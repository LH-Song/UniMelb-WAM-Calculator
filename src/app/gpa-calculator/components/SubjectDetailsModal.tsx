// SubjectDetailsModal.tsx
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { EllipsisVerticalIcon, PlusIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { calculateWAM } from '@/utils/calculateWAM'
import ShareResult from './ShareResult'
import { WAMGoalEvaluator } from './WAMGoalEvaluator'
import AssessmentForm from './AssessmentForm'
import { Button } from '@/components/Button'

interface Props {
  subject: Subject
  onClose: () => void
  onDelete: (subjectID: string) => void
  onUpdate: (updatedSubject: Subject) => void
  onAddAssessment: (
    subjectId: string,
    newAssessment: AssessmentInputData,
  ) => void
  onUpdateAssessment: (subjectId: string, updatedAssessment: Assessment) => void
  onDeleteAssessment: (subjectId: string, assessmentId: string) => void
}

const SubjectDetailsModal: React.FC<Props> = ({
  subject,
  onClose,
  onDelete,
  onUpdate,
  onAddAssessment,
  onUpdateAssessment,
  onDeleteAssessment,
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(
    null,
  )
  const [addingAssessment, setAddingAssessment] = useState<boolean>(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.origin + window.location.pathname
      const wam = calculateWAM([subject]).toFixed(2)
      const urlWithParams = `${currentUrl}?wam=${encodeURIComponent(wam)}`
      setShareUrl(urlWithParams)
    }
  }, [subject])

  const closeModal = useCallback(() => {
    setIsVisible(false)
    setTimeout(onClose, 500)
  }, [onClose])

  const handleDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
      onDelete(subject.id)
      closeModal()
      alert('Subject deleted successfully.')
    }
  }, [subject.id, subject.name, onDelete, closeModal])

  const handleAddAssessment = useCallback(() => {
    setAddingAssessment(true)
  }, [])

  const handleSaveNewAssessment = useCallback(
    (assessmentData: AssessmentInputData) => {
      onAddAssessment(subject.id, assessmentData)
      setAddingAssessment(false)
      alert('Assessment added successfully.')
    },
    [subject.id, onAddAssessment],
  )

  const handleEditAssessment = useCallback((assessment: Assessment) => {
    setEditingAssessment(assessment)
  }, [])

  const handleUpdateAssessmentLocal = useCallback(
    (assessmentData: AssessmentInputData) => {
      if (editingAssessment) {
        const updatedAssessment: Assessment = {
          id: editingAssessment.id,
          ...assessmentData,
        }
        onUpdateAssessment(subject.id, updatedAssessment)
        setEditingAssessment(null)
        alert('Assessment updated successfully.')
      }
    },
    [subject.id, editingAssessment, onUpdateAssessment],
  )

  const handleDeleteAssessment = useCallback(
    (assessmentId: string) => {
      if (window.confirm('Are you sure you want to delete this assessment?')) {
        onDeleteAssessment(subject.id, assessmentId)
        alert('Assessment deleted successfully.')
      }
    },
    [subject.id, onDeleteAssessment],
  )

  return (
    <Dialog open={true} onClose={closeModal} className="relative z-50">
      {/* 背景遮罩 */}
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* 对话框容器 */}
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
        {/* 对话框面板 */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-md transform transition-transform duration-500 ease-in-out ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <DialogPanel className="relative flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <DialogTitle className="text-lg font-medium text-gray-900">
                {subject.name}
              </DialogTitle>
              <button
                onClick={closeModal}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6" ref={resultRef}>
              {/* 科目信息 */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Current WAM: {calculateWAM([subject]).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Semester: {subject.semester}
                </p>
                <p className="text-sm text-gray-500">
                  Credit Points: {subject.credit}
                </p>
                <p className="text-sm text-gray-500">
                  Included in WAM Calculation: {subject.included ? 'Yes' : 'No'}
                </p>
              </div>

              {/* 评估列表 */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">
                    Assessments
                  </h3>
                  <Button
                    onClick={handleAddAssessment}
                  >
                    <PlusIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Add Assessment
                  </Button>
                </div>
                <ul className="mt-2 divide-y divide-gray-200">
                  {subject.assessments.map((assessment) => (
                    <AssessmentItem
                      key={assessment.id}
                      assessment={assessment}
                      onEdit={handleEditAssessment}
                      onDelete={handleDeleteAssessment}
                    />
                  ))}
                </ul>
              </div>

              {/* WAM目标评估器 */}
              <div className="mt-4">
                <WAMGoalEvaluator subject={subject} />
              </div>

              {/* ShareResult 组件 */}
              <div className="mt-4">
                <ShareResult resultRef={resultRef} shareUrl={shareUrl} />
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="p-6">
              <button
                onClick={handleDelete}
                className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete Subject
              </button>
            </div>

            {/* 评估编辑/添加模态框 */}
            {(editingAssessment !== null || addingAssessment) && (
              <Dialog
                open={true}
                onClose={() => {
                  setEditingAssessment(null)
                  setAddingAssessment(false)
                }}
                className="relative z-50"
              >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      {addingAssessment ? 'Add Assessment' : 'Edit Assessment'}
                    </DialogTitle>
                    <AssessmentForm
                      assessment={editingAssessment ?? undefined}
                      onSave={
                        addingAssessment
                          ? handleSaveNewAssessment
                          : handleUpdateAssessmentLocal
                      }
                      onCancel={() => {
                        setEditingAssessment(null)
                        setAddingAssessment(false)
                      }}
                    />
                  </DialogPanel>
                </div>
              </Dialog>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

interface AssessmentItemProps {
  assessment: Assessment
  onEdit: (assessment: Assessment) => void
  onDelete: (assessmentId: string) => void
}

const AssessmentItem: React.FC<AssessmentItemProps> = React.memo(
  ({ assessment, onEdit, onDelete }) => (
    <li className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{assessment.name}</p>
        <p className="text-sm text-gray-500">Weight: {assessment.weight}%</p>
        <p className="text-sm text-gray-500">
          Marks: {assessment.obtained_marks} / {assessment.full_marks}
        </p>
      </div>
      <Menu
        as="div"
        className="relative ml-2 inline-block flex-shrink-0 text-left"
      >
        <MenuButton className="group relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
        </MenuButton>
        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } block w-full px-4 py-2 text-left text-sm`}
                  onClick={() => onEdit(assessment)}
                >
                  Edit {assessment.name}
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } block w-full px-4 py-2 text-left text-sm`}
                  onClick={() => onDelete(assessment.id)}
                >
                  Delete {assessment.name}
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </li>
  ),
)

export default React.memo(SubjectDetailsModal)
