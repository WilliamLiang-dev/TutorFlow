# TutorFlow

TutorFlow is a tutoring management web application designed to help private tutors manage students, lesson schedules, lesson records, and confirmation workflows in one place.

The project is currently under active development.

## Project Motivation

Private tutors often manage lesson schedules, student information, homework, lesson records, and confirmations across different tools such as calendars, spreadsheets, and messaging applications.

TutorFlow aims to combine these tasks into one system and reduce the need for manual reminders between tutors and students.

## Current Features

- Custom weekly calendar interface
- Student overview and student preview cards
- Student search
- Teacher-student connection management
- Multiple subject assignments for each student
- Different default hourly rates for each subject
- Lesson record structure
- Teacher and student lesson verification
- Responsive dashboard layout
- Placeholder data for frontend development

## Core Data Model

### TeacherStudentConnection

Represents the relationship between one teacher and one student.

It stores information such as:

- Teacher ID
- Student ID
- Connection status
- Student card colour
- Student display order

### TeachingAssignment

Represents a subject taught under a teacher-student connection.

One teacher may teach the same student multiple subjects.

Each assignment stores:

- Subject
- Default hourly rate
- Assignment status

### Lesson

Represents one actual tutoring session.

Each lesson may contain:

- Date
- Start and end time
- Subject
- Hourly rate
- Teacher comments
- Homework
- Teacher verification
- Student verification
- Lesson status
- Cancellation information

The main relationship is:

```text
Lesson
-> TeachingAssignment
-> TeacherStudentConnection
-> Teacher and Student
```

## Planned MVP Workflow

```text
Teacher signs in
-> adds or invites a student
-> creates a lesson
-> records lesson details
-> confirms the lesson
-> student receives a web push notification
-> student reviews and confirms the lesson
-> teacher receives a confirmation notification
```

## Planned Features

- Google authentication
- Student email invitations
- Teacher and student profile settings
- Editable display names and avatars
- Lesson creation and editing
- Dual lesson confirmation
- Real web push notifications
- Recurring lesson generation
- Drag-and-drop calendar rescheduling
- Mobile-responsive interface
- Student lesson history
- Invoice generation
- File sharing

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Development Tools

- Git
- GitHub
- VS Code
- pnpm
- Vercel

### Backend and Database

Planned or under integration:

- PostgreSQL
- Neon
- Server-side authentication
- Server-side authorization

## Getting Started

### Requirements

- Node.js
- pnpm

### Installation

Clone the repository:

```bash
git clone https://github.com/WilliamLiang-dev/TutorFlow.git
```

Enter the project directory:

```bash
cd TutorFlow
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the application in your browser:

```text
http://localhost:3000
```

## Available Scripts

Start the development server:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

Run the project linter:

```bash
pnpm lint
```

## Development Roadmap

### Stage 1: Frontend Prototype

- Build the dashboard interface
- Build the custom weekly calendar
- Build the student overview
- Create student preview cards
- Test data relationships using placeholder data

### Stage 2: Backend Integration

- Add authentication
- Connect PostgreSQL
- Add teacher and student authorization
- Replace placeholder data with database queries

### Stage 3: Core Workflow

- Add student invitations
- Add lesson creation
- Add teacher and student confirmation
- Add real web push notifications

### Stage 4: Productivity Features

- Add recurring lesson generation
- Add drag-and-drop lesson rescheduling
- Improve the mobile interface
- Add invoice generation
- Add file sharing

## Current Limitations

- Major frontend sections currently use placeholder data
- Authentication is not fully connected
- Student invitation acceptance is not implemented
- Web push notifications are not implemented
- Calendar drag-and-drop is not implemented
- Recurring lesson generation is not implemented
- Invoice and file-sharing features are not implemented


## Author

William Liang

Computer Engineering student at The Hong Kong University of Science and Technology