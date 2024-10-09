## Overview

This project is a web application designed to help students calculate their Weighted Average Mark (WAM) at the University of Melbourne. It allows users to input their subjects and assessments, calculate their WAM, set academic goals, and share their results. The application is built with Next.js, TypeScript, and Tailwind CSS, utilizing modern features like the Next.js App Router and NextAuth.js for authentication.

Open [https://uni-melb-gpa-calculator.vercel.app](https://uni-melb-gpa-calculator.vercel.app) in your browser to view the website.

# Table of Contents

- [Overview](#overview)
- [Components](#components)
  - [SubjectDetailsModal](#subjectdetailsmodal)
  - [AssessmentFields](#assessmentfields)
  - [AssessmentForm](#assessmentform)
  - [AssessmentItem](#assessmentitem)
  - [WAMGoalEvaluator](#wamgoalevaluator)
  - [ShareResult](#shareresult)
  - [Header](#header)
- [File Structure and Design Decisions](#file-structure-and-design-decisions)
  - [Component Organization](#component-organization)
  - [Reasons for Inline Components](#reasons-for-inline-components)
  - [Trade-offs](#trade-offs)
- [Authentication](#authentication)
  - [NextAuth.js with Google Provider](#nextauthjs-with-google-provider)
- [How to Use the Calculator](#how-to-use-the-calculator)
- [Learn more](#learn-more)
- [License](#license)
- [Contact](#contact)

## Components

### SubjectDetailsModal

**File**: `SubjectDetailsModal.tsx`

**Purpose**:
- Displays detailed information about a selected subject.
- Allows users to add, edit, and delete assessments within the subject.
- Integrates the WAMGoalEvaluator to help users set and evaluate academic goals.
- Includes the ShareResult component to enable users to share their WAM/GPA results.

**Design Rationale**:
- **Modular Design**: By encapsulating subject details and related functionalities into a modal, we provide a focused user experience without navigating away from the main page.
- **Right-Side Slide-in**: The modal slides in from the right side, providing a smooth transition and keeping the user context intact.
- **Integration with Other Components**: Combines multiple functionalities (assessment management, goal evaluation, result sharing) in a cohesive interface.

### AssessmentFields

**File**: `AssessmentForm.tsx` (as an inline component)

**Purpose**:
- Renders input fields for creating or editing an assessment.
- Handles user input for assessment details like name, weight, full marks, minimum pass requirement, and obtained marks.
- Includes validation logic to prevent errors like NaN values when input fields are empty.

**Design Rationale**:
- **Inline Component**: Kept within `AssessmentForm.tsx` due to its tight coupling with the form logic, reducing complexity and file fragmentation.
- **Input Validation**: Ensures data integrity by handling empty inputs and preventing invalid data from affecting calculations.
- **User Experience**: Provides immediate feedback and validation as users input data.

### AssessmentForm

**File**: `AssessmentForm.tsx`

**Purpose**:
- Provides a form for adding a new assessment or editing an existing one.
- Utilizes the `AssessmentFields` component for input fields.
- Handles form submission and cancellation actions.

**Design Rationale**:
- **Separation of Concerns**: Splits form logic from display logic, making the codebase easier to maintain and extend.
- **Flexibility**: Can be used for both adding and editing assessments by passing appropriate props.

### AssessmentItem

**File**: `SubjectDetailsModal.tsx` (as an inline component)

**Purpose**:
- Displays individual assessment details within the assessment list.
- Provides options to edit or delete the assessment via a dropdown menu.

**Design Rationale**:
- **Inline Component**: Defined within `SubjectDetailsModal.tsx` because it’s only used there, reducing unnecessary file separation.
- **Clarity**: Presents assessment information in a clear and concise manner.
- **User Actions**: Allows users to quickly access actions related to each assessment without cluttering the interface.

### WAMGoalEvaluator

**File**: `WAMGoalEvaluator.tsx`

**Purpose**:
- Helps users set academic goals by calculating the required marks to achieve a desired WAM/GPA.
- Provides feedback on what is needed in future assessments to meet these goals.

**Design Rationale**:
- **Independent Component**: Separated into its own file due to its standalone functionality and potential for reuse.
- **Goal-Oriented**: Encourages users to plan and strive for their academic targets.
- **Interactivity**: Engages users by allowing them to input desired outcomes and see actionable results.

### ShareResult

**File**: `ShareResult.tsx`

**Purpose**:
- Enables users to share their WAM/GPA results.
- Provides options to download a screenshot of the results or share via social media platforms like Twitter.

**Design Rationale**:
- **Independent Component**: Separated for potential reuse and to encapsulate sharing logic.
- **Ease of Sharing**: Simplifies the process of sharing achievements with peers or on social media.
- **Engagement**: Encourages user interaction and can help promote the application through user sharing.

### Header

**File**: `Header.tsx`

**Purpose**:
- Serves as the main navigation header for the application.
- Integrates authentication features, displaying “Sign in” or “Sign out” buttons based on user session.
- Shows the user’s name or avatar when logged in.

**Design Rationale**:
- **User-Centric**: Provides immediate access to authentication actions.
- **Responsive Design**: Adapts to different screen sizes, ensuring usability across devices.
- **Integration with NextAuth.js**: Leverages authentication hooks to reflect real-time user status.

## File Structure and Design Decisions

### Component Organization

- **Flat Structure**: Components are organized in a way that balances modularity and simplicity. Core components are placed in the `components` directory.
- **Grouping by Functionality**: Related components are grouped together, making it easier to locate and manage them.

**Example:**

```bash
components/
├── Header.tsx
├── SubjectDetailsModal.tsx
├── AssessmentForm.tsx
├── WAMGoalEvaluator.tsx
├── ShareResult.tsx
└── …other components
```


### Reasons for Inline Components

Some components, such as `AssessmentFields` and `AssessmentItem`, are defined within other component files instead of being separated into their own files.

#### Reasons:

1. **Single Use**: These components are only used within a specific parent component (`AssessmentForm` and `SubjectDetailsModal`, respectively). Extracting them into separate files would not provide significant reuse benefits.
2. **Reduced Complexity**: Keeping tightly coupled components together simplifies the file structure and reduces the number of files developers need to navigate.
3. **Enhanced Readability**: By defining inline components, the related code stays in one place, making it easier to understand the flow and relationships between components.
4. **Performance Considerations**: Fewer component files can lead to slight performance improvements during development due to reduced file reads.

### Trade-offs

- **Maintainability**: While inline components can simplify the structure, they may grow in complexity. In such cases, we monitor the components and refactor them into separate files if they become too large or are needed elsewhere.
- **Scalability**: The current design suits the application’s size and scope. If the application grows, we may revisit the file structure for better scalability.

---

## Authentication

### NextAuth.js with Google Provider

**Configuration File**: `app/api/auth/[...nextauth]/route.ts`

**Purpose**:
- Handles user authentication using NextAuth.js with Google as the authentication provider.
- Manages user sessions and secure access to application features.

**Design Rationale**:
- **Route Handlers in App Router**: Since we are using Next.js App Router, authentication is set up using Route Handlers, aligning with Next.js 13+ conventions.
- **Security**: Implements industry-standard authentication practices.
- **User Convenience**: Allows users to log in using their existing Google accounts, reducing friction.

---

## How to Use the Calculator

Using this calculator is straightforward:

1. **Sign In**:
   - Click the “Sign in” button in the header to log in using your Google account.

2. **Add Subjects**:
   - Input your subjects by providing the subject name, semester, credit points, and whether it’s included in the WAM calculation.

3. **Add Assessments**:
   - For each subject, add assessments by specifying the name, weight, full marks, minimum pass requirement, and obtained marks if available.

4. **Calculate WAM/GPA**:
   - The application automatically calculates your WAM/GPA based on the provided data.

5. **Set Goals**:
   - Use the `WAMGoalEvaluator` to set desired academic goals and see what is required to achieve them.

6. **Share Results**:
   - Utilize the `ShareResult` component to download a screenshot of your results or share them on social media.

---

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
- [Framer Motion](https://www.framer.com/docs/) - the official Framer Motion documentation
- [MDX](https://mdxjs.com/) - the official MDX documentation
- [Algolia Autocomplete](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/) - the official Algolia Autocomplete documentation
- [FlexSearch](https://github.com/nextapps-de/flexsearch) - the official FlexSearch documentation
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) - the official Zustand documentation

---

## License

This project is licensed under the MIT License.

---

## Contact

ling.h.song@gmail.com
