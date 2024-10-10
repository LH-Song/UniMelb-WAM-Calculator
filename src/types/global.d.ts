// global.d.ts
declare global {
  interface Assessment {
    id: string
    name: string
    weight: number
    full_marks: number
    minimum_pass_requirement: number
    obtained_marks?: number
  }

  interface Subject {
    id: string
    name: string
    passingGrade: number
    bgColor: string
    assessments: Assessment[]
    semester: string
    credit: number 
    included: boolean
  }

  type SubjectFormData = Omit<Subject, 'id' | 'assessments'> & {
    assessments: Omit<Assessment, 'id'>[]
    credit: number 
    included: boolean
  }

  type Semester = string

  type NewAssessment = Omit<Assessment, 'id'>

  type AssessmentInputData = Omit<Assessment, 'id'>
}

export {}
