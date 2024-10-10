// useSubjectManagement.ts
'use client'

import { useState, useMemo, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const useSubjectManagement = () => {
  // 使用函数式初始化从 localStorage 加载 subjects
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSubjects = localStorage.getItem('subjects')
        const parsedSubjects = storedSubjects ? JSON.parse(storedSubjects) : []
        // 为每个科目设置默认的 credit 和 included 值
        const subjectsWithDefaults = parsedSubjects.map((subject: Subject) => ({
          ...subject,
          credit: subject.credit || 12, // 默认学分为12
          included: subject.included !== false, // 默认包含在计算中
        }))
        return subjectsWithDefaults
      } catch (error) {
        console.error('Error parsing subjects from localStorage', error)
        return []
      }
    }
    return []
  })

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedSemester, setSelectedSemester] = useState<string>('All')

  // 生成学期列表
  const semesters = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1
    return [
      'All',
      `${currentYear} First Semester`,
      `${currentYear} Second Semester`,
      `${nextYear} First Semester`,
      `${nextYear} Second Semester`,
    ]
  }, [])

  // 保存 subjects 到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('subjects', JSON.stringify(subjects))
      } catch (error) {
        console.error('Error saving subjects to localStorage', error)
      }
    }
  }, [subjects])

  // 添加新科目
  const addSubject = (subjectData: SubjectFormData) => {
    const newSubject: Subject = {
      ...subjectData,
      id: uuidv4(),
      assessments: subjectData.assessments.map((assessment) => ({
        ...assessment,
        id: uuidv4(),
      })),
      credit: subjectData.credit, // 确保包含此行
      included: subjectData.included, // 确保包含此行
    }
    setSubjects((prevSubjects) => [...prevSubjects, newSubject])
    setIsDialogOpen(false)
  }

  // Function to update an existing subject
  const updateSubject = (updatedSubject: Subject) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === updatedSubject.id ? updatedSubject : subject,
      ),
    )
    // Update selectedSubject if it's the one being updated
    if (selectedSubject && selectedSubject.id === updatedSubject.id) {
      setSelectedSubject(updatedSubject)
    }
  }

  // Function to delete a subject
  const deleteSubject = (subjectId: string) => {
    setSubjects((prevSubjects) =>
      prevSubjects.filter((subject) => subject.id !== subjectId),
    )
    // Close the modal if the deleted subject was selected
    if (selectedSubject && selectedSubject.id === subjectId) {
      setSelectedSubject(null)
    }
  }

  // Function to add an assessment to a subject
  const addAssessment = (
    subjectId: string,
    newAssessmentData: AssessmentInputData,
  ) => {
    const newAssessment: Assessment = { ...newAssessmentData, id: uuidv4() }
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              assessments: [...subject.assessments, newAssessment],
            }
          : subject,
      ),
    )
    // Update selectedSubject if it's the one being modified
    if (selectedSubject && selectedSubject.id === subjectId) {
      setSelectedSubject({
        ...selectedSubject,
        assessments: [...selectedSubject.assessments, newAssessment],
      })
    }
  }

  // Function to update an assessment
  const updateAssessment = (
    subjectId: string,
    updatedAssessment: Assessment,
  ) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              assessments: subject.assessments.map((assessment) =>
                assessment.id === updatedAssessment.id
                  ? updatedAssessment
                  : assessment,
              ),
            }
          : subject,
      ),
    )
    // Update selectedSubject if it's the one being modified
    if (selectedSubject && selectedSubject.id === subjectId) {
      setSelectedSubject({
        ...selectedSubject,
        assessments: selectedSubject.assessments.map((assessment) =>
          assessment.id === updatedAssessment.id
            ? updatedAssessment
            : assessment,
        ),
      })
    }
  }

  // Function to delete an assessment
  const deleteAssessment = (subjectId: string, assessmentId: string) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              assessments: subject.assessments.filter(
                (assessment) => assessment.id !== assessmentId,
              ),
            }
          : subject,
      ),
    )
    // Update selectedSubject if it's the one being modified
    if (selectedSubject && selectedSubject.id === subjectId) {
      setSelectedSubject({
        ...selectedSubject,
        assessments: selectedSubject.assessments.filter(
          (assessment) => assessment.id !== assessmentId,
        ),
      })
    }
  }

  // Function to open subject details modal
  const openSubjectDetails = (subject: Subject) => {
    setSelectedSubject(subject)
  }

  // Function to close subject details modal
  const closeSubjectDetails = () => {
    setSelectedSubject(null)
  }

  // Function to handle semester selection
  const handleSemesterSelect = (semester: string) => {
    setSelectedSemester(semester)
  }

  return {
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
  }
}

export default useSubjectManagement
