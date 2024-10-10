// SubjectContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from 'react'

// Define the types for your actions
type Action =
  | { type: 'SET_SUBJECTS'; payload: Subject[] }
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | {
      type: 'ADD_ASSESSMENT'
      payload: { subjectId: string; assessment: Assessment }
    }
  | {
      type: 'UPDATE_ASSESSMENT'
      payload: { subjectId: string; assessment: Assessment }
    }
  | {
      type: 'DELETE_ASSESSMENT'
      payload: { subjectId: string; assessmentId: string }
    }

// Define the state type
type State = {
  subjects: Subject[]
}

// Define the Dispatch type
type Dispatch = (action: Action) => void

// Create the context
const SubjectContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

// Reducer function to handle state changes
const subjectReducer = (state: State, action: Action): State => {
  let newState: State
  switch (action.type) {
    case 'SET_SUBJECTS':
      newState = { ...state, subjects: action.payload }
      break

    case 'ADD_SUBJECT':
      newState = { ...state, subjects: [...state.subjects, action.payload] }
      break

    case 'UPDATE_SUBJECT':
      newState = {
        ...state,
        subjects: state.subjects.map((subject) =>
          subject.id === action.payload.id ? action.payload : subject,
        ),
      }
      break

    case 'DELETE_SUBJECT':
      newState = {
        ...state,
        subjects: state.subjects.filter(
          (subject) => subject.id !== action.payload,
        ),
      }
      break

    case 'ADD_ASSESSMENT':
      newState = {
        ...state,
        subjects: state.subjects.map((subject) =>
          subject.id === action.payload.subjectId
            ? {
                ...subject,
                assessments: [
                  ...subject.assessments,
                  action.payload.assessment,
                ],
              }
            : subject,
        ),
      }
      break

    case 'UPDATE_ASSESSMENT':
      newState = {
        ...state,
        subjects: state.subjects.map((subject) =>
          subject.id === action.payload.subjectId
            ? {
                ...subject,
                assessments: subject.assessments.map((assessment) =>
                  assessment.id === action.payload.assessment.id
                    ? action.payload.assessment
                    : assessment,
                ),
              }
            : subject,
        ),
      }
      break

    case 'DELETE_ASSESSMENT':
      newState = {
        ...state,
        subjects: state.subjects.map((subject) =>
          subject.id === action.payload.subjectId
            ? {
                ...subject,
                assessments: subject.assessments.filter(
                  (assessment) => assessment.id !== action.payload.assessmentId,
                ),
              }
            : subject,
        ),
      }
      break

    default:
      return state
  }

  // Update localStorage with the new state
  localStorage.setItem('subjects', JSON.stringify(newState.subjects))
  return newState
}

// Function to load subjects from localStorage
const loadSubjectsFromStorage = (): Subject[] => {
  if (typeof window === 'undefined') {
    return []
  }
  const storedSubjects = localStorage.getItem('subjects')
  if (storedSubjects) {
    try {
      return JSON.parse(storedSubjects)
    } catch (error) {
      console.error('Failed to parse subjects from localStorage:', error)
    }
  }
  return []
}

// The provider component that wraps your app and makes the context available
export const SubjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(subjectReducer, { subjects: [] })

  useEffect(() => {
    const loadedSubjects = loadSubjectsFromStorage()
    dispatch({ type: 'SET_SUBJECTS', payload: loadedSubjects })
  }, [])

  return (
    <SubjectContext.Provider value={{ state, dispatch }}>
      {children}
    </SubjectContext.Provider>
  )
}

// Custom hook to use the SubjectContext
export const useSubjectContext = () => {
  const context = useContext(SubjectContext)
  if (context === undefined) {
    throw new Error('useSubjectContext must be used within a SubjectProvider')
  }
  return context
}
