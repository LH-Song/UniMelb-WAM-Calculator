// SubjectList.tsx
'use client'

import React, { useCallback } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/20/solid'

interface Props {
  subjects: Subject[]
  onSubjectClick: (subject: Subject) => void
  selectedSemester: string
  semesters: string[]
  onSemesterSelect: (semester: string) => void
}

export default function SubjectList({
  subjects,
  onSubjectClick,
  selectedSemester,
  semesters,
  onSemesterSelect,
}: Props) {
  const handleSemesterSelect = useCallback(
    (semester: string) => {
      onSemesterSelect(semester)
    },
    [onSemesterSelect],
  )

  const filteredSubjects = React.useMemo(
    () =>
      selectedSemester === 'All' || !selectedSemester
        ? subjects
        : subjects.filter((subject) => subject.semester === selectedSemester),
    [subjects, selectedSemester],
  )

  return (
    <div>
      <Menu as="div" className="relative mb-4 inline-block text-left">
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {selectedSemester || 'Select Semester'}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </MenuButton>
        <MenuItems className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {semesters.map((semester) => (
              <MenuItem key={semester}>
                {({ active }) => (
                  <button
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                    onClick={() => handleSemesterSelect(semester)}
                  >
                    {semester}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>

      {filteredSubjects.length === 0 ? (
        <p>No subjects available.</p>
      ) : (
        <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
          {filteredSubjects.map((subject) => (
            <li
              key={subject.id}
              className="col-span-1 flex cursor-pointer rounded-md shadow-sm"
              onClick={() => onSubjectClick(subject)}
            >
              <div
                className={`bg-green-200 flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white`}
              >
                {subject.name.charAt(0)}
              </div>
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <p className="font-medium text-gray-900">{subject.name}</p>
                  <p className="text-gray-500">
                    {subject.assessments.length} Assessments
                  </p>
                  <p className="text-gray-500">
                    Passing Grade: {subject.passingGrade}%
                  </p>
                </div>
                <div className="flex-shrink-0 pr-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
