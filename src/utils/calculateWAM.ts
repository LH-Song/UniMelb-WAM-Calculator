// utils/calculateWAM.ts

export function calculateWAM(subjects: Subject[]): number {
  let totalWeightedMarks = 0
  let totalCredits = 0

  subjects.forEach((subject) => {
    if (subject.included && subject.assessments.length > 0) {
      // 计算科目的总得分百分比
      const totalObtainedMarks = subject.assessments.reduce(
        (sum, assessment) => sum + (assessment.obtained_marks || 0),
        0,
      )
      const totalFullMarks = subject.assessments.reduce(
        (sum, assessment) => sum + assessment.full_marks,
        0,
      )
      const subjectGrade = (totalObtainedMarks / totalFullMarks) * 100

      totalWeightedMarks += subjectGrade * subject.credit
      totalCredits += subject.credit
    }
  })

  return totalCredits > 0 ? totalWeightedMarks / totalCredits : 0
}
