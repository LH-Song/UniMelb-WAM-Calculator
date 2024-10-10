'use client'

import { Button } from '@/components/Button'
import useValidatedInput from '@/hooks/useValidatedInput'

import React, { useState } from 'react'

interface Props {
  subject: Subject
}

export function WAMGoalEvaluator({ subject }: Props) {
  const [resultMessage, setResultMessage] = useState<string>('')
  const [currentWAM, setCurrentWAM] = useState<number>(0)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [highPassPercentage, handlePercentageChange, handlePercentageBlur] =
    useValidatedInput('60', 60, 100)

  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGoal(event.target.value)
    if (event.target.value !== 'high-pass') {
      handlePercentageChange({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleCalculate = () => {
    // 计算当前科目的总得分百分比（当前 WAM）
    const totalObtainedMarks = subject.assessments.reduce((sum, assessment) => {
      return sum + (assessment.obtained_marks || 0)
    }, 0)

    const totalFullMarks = subject.assessments.reduce((sum, assessment) => {
      return sum + assessment.full_marks
    }, 0)

    const currentPercentage = (totalObtainedMarks / totalFullMarks) * 100
    setCurrentWAM(currentPercentage)

    // 确定目标分数
    const targetPercentage =
      selectedGoal === 'low-pass' ? 60 : Number(highPassPercentage)

    if (currentPercentage >= targetPercentage) {
      setResultMessage(
        `Congratulations! You have reached your goal. Current WAM: ${currentPercentage.toFixed(
          2,
        )}%`,
      )
    } else {
      const requiredResult = calculateRequiredMarks(
        subject,
        targetPercentage,
        totalObtainedMarks,
      )

      switch (requiredResult.status) {
        case 'achieved':
          setResultMessage(
            `Congratulations! You have reached your goal. Current WAM: ${currentPercentage.toFixed(
              2,
            )}%`,
          )
          break
        case 'unachievable':
          setResultMessage(
            `Unfortunately, it's not possible to reach your goal with the remaining assessments. Current WAM: ${currentPercentage.toFixed(
              2,
            )}%`,
          )
          break
        case 'noRemaining':
          setResultMessage(
            `Unfortunately, you did not reach your goal and there are no remaining assessments. Current WAM: ${currentPercentage.toFixed(
              2,
            )}%`,
          )
          break
        case 'possible':
          setResultMessage(
            `To reach your goal, you need to score an average of at least ${requiredResult.value.toFixed(
              2,
            )}% in the remaining assessments. Current WAM: ${currentPercentage.toFixed(
              2,
            )}%`,
          )
          break
        default:
          setResultMessage('An error occurred during calculation.')
      }
    }
  }

  const calculateRequiredMarks = (
    subject: Subject,
    targetPercentage: number,
    totalObtainedMarks: number,
  ) => {
    const totalFullMarks = subject.assessments.reduce(
      (sum, assessment) => sum + assessment.full_marks,
      0,
    )

    const requiredTotalMarks = (targetPercentage / 100) * totalFullMarks

    const requiredMarks = requiredTotalMarks - totalObtainedMarks

    const remainingAssessments = subject.assessments.filter(
      (assessment) =>
        assessment.obtained_marks === undefined ||
        assessment.obtained_marks === null ||
        assessment.obtained_marks === 0,
    )

    const remainingFullMarks = remainingAssessments.reduce(
      (sum, assessment) => sum + assessment.full_marks,
      0,
    )

    // 如果没有剩余评估，无法再得分
    if (remainingFullMarks === 0) {
      return { status: 'noRemaining', value: 0 }
    }

    // 如果 requiredMarks <= 0，表示已经达到目标
    if (requiredMarks <= 0) {
      return { status: 'achieved', value: 0 }
    }

    // 如果 requiredMarks > 剩余满分，无法达到目标
    if (requiredMarks > remainingFullMarks) {
      return { status: 'unachievable', value: 0 }
    }

    // 计算在剩余评估中需要的平均百分比
    const requiredAveragePercentage = (requiredMarks / remainingFullMarks) * 100

    return { status: 'possible', value: requiredAveragePercentage }
  }

  return (
    <fieldset className="mt-2">
      <legend className="text-sm font-semibold leading-6 text-gray-900">
        Goal
      </legend>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        What marks do you want to achieve in this subject?
      </p>
      <div className="mt-6 space-y-6">
        <div className="flex items-center">
          <input
            id="low-pass"
            name="goal"
            type="radio"
            value="low-pass"
            checked={selectedGoal === 'low-pass'}
            onChange={handleGoalChange}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
          <label
            htmlFor="low-pass"
            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
          >
            low pass (60%)
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="high-pass"
            name="goal"
            type="radio"
            value="high-pass"
            checked={selectedGoal === 'high-pass'}
            onChange={handleGoalChange}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
          <label
            htmlFor="high-pass"
            className="ml-3 flex items-center text-sm font-medium leading-6 text-gray-900"
          >
            <span>high pass</span>
            {selectedGoal === 'high-pass' && (
              <input
                id="high-pass-percentage"
                name="high-pass-percentage"
                type="number"
                value={highPassPercentage}
                onChange={handlePercentageChange}
                onBlur={handlePercentageBlur}
                placeholder="Enter your target score"
                className="no-spinner border-1 ml-1 min-w-48 rounded-md py-1.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200"
              />
            )}
          </label>
        </div>

        {resultMessage && (
          <div className="mt-4 text-sm text-blue-600">{resultMessage}</div>
        )}

        <Button
          onClick={handleCalculate}
        >
          Calculate
        </Button>
      </div>
    </fieldset>
  )
}
