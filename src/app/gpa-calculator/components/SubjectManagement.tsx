// SubjectManagement.tsx
'use client'

import React from 'react'
import { Button } from '@/components/Button'
import useSubjectManagement from '@/hooks/useSubjectManagement'
import SubjectDetailsModal from './SubjectDetailsModal'
import SubjectForm from './SubjectForm'
import SubjectList from './SubjectList'

const SubjectManagement: React.FC = () => {
  const {
    subjects,
    isDialogOpen,
    setIsDialogOpen,
    selectedSubject,
    selectedSemester,
    semesters,
    addSubject,
    updateSubject,
    deleteSubject,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    openSubjectDetails,
    closeSubjectDetails,
    handleSemesterSelect,
  } = useSubjectManagement()

  return (
    <div>
      <div className="mb-4 flex justify-between sm:flex-row sm:items-center">
        <h2 className="m-0 block text-sm font-medium text-gray-500 sm:mb-0">
          Subjects List
        </h2>
        <Button
          className="ml-4 sm:ml-auto"
          onClick={() => setIsDialogOpen(true)}
        >
          Add Subject
        </Button>
      </div>

      <SubjectList
        subjects={subjects}
        onSubjectClick={openSubjectDetails}
        selectedSemester={selectedSemester}
        semesters={semesters}
        onSemesterSelect={handleSemesterSelect}
      />

      <SubjectForm.Modal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={addSubject}
      />

      {selectedSubject && (
        <SubjectDetailsModal
          subject={selectedSubject}
          onClose={closeSubjectDetails}
          onDelete={deleteSubject}
          onUpdate={updateSubject}
          onAddAssessment={addAssessment}
          onUpdateAssessment={updateAssessment}
          onDeleteAssessment={deleteAssessment}
        />
      )}
    </div>
  )
}

export default React.memo(SubjectManagement)
