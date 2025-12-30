import { z } from 'zod';

// Project Schema
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['ongoing', 'completed']),
  Introduction: z.string().min(1, 'Introduction is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  Mentor: z.string().min(1, 'Mentor is required'),
  category: z.enum(['Vlsi', 'Embedded', 'AI and ML']),
  Members: z.array(z.string()).optional(),
  Statement: z.string().optional(),
  Abstract: z.string().optional(),
  Conclusion: z.string().optional(),
  Results: z.string().optional(),
  futureScope: z.string().optional(),
  Tools: z.array(z.string()).optional(),
  Methodology: z.string().optional(),
  referenceLinks: z.array(z.string().url()).optional(),
  Link: z.string().url().optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Event Schema
export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  eventType: z.string().optional(),
  aboutEvent: z.string().optional(),
  eventRegistrationLink: z.string().url().optional().or(z.literal('')),
  eventPdfLink: z.string().url().optional().or(z.literal('')),
  eventVideoLink: z.string().url().optional().or(z.literal('')),
  noOfParticipants: z.coerce.number().int().positive().optional(),
  eventDate: z.string().min(1, 'Event date is required'),
  eventHighlights: z.array(z.string()).optional(),
  studentCoordinators: z.array(z.string()).optional(),
  facultyCoordinators: z.array(z.string()).optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']),
  speakerName: z.string().optional(),
  speakerDescription: z.string().optional(),
  speakerHighlights: z.array(z.string()).optional(),
});

// Club Member Schema
export const clubMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  sectionBranch: z.string().min(1, 'Section/Branch is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  memberShipId: z.string().optional(),
});

// Core Member Schema
export const coreMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  sectionBranch: z.string().min(1, 'Section/Branch is required'),
  portfolio: z.string().min(1, 'Portfolio is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  category: z.string().min(1, 'Category is required'),
  teamCategory: z.string().optional(),
  memberShipId: z.string().optional(),
});

// Question Bank Schema
export const questionBankSchema = z.object({
  topicName: z.string().min(1, 'Topic name is required'),
  subject: z.string().min(1, 'Subject is required'),
  link: z.string().url('Invalid link'),
});

// Textbook Schema
export const textbookSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  subject: z.string().min(1, 'Subject is required'),
  author: z.string().min(1, 'Author is required'),
  link: z.string().url('Invalid link'),
});

// NPTEL Lecture Schema
export const nptelLectureSchema = z.object({
  courseName: z.string().min(1, 'Course name is required'),
  professorName: z.string().min(1, 'Professor name is required'),
  link: z.string().url('Invalid link'),
});

// Placement Prep Schema
export const placementPrepSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  link: z.string().url('Invalid link'),
});

// VLSI Material Schema
export const vlsiMaterialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  link: z.string().url('Invalid link'),
});

// GATE PYQ Schema
export const gatePyqSchema = z.object({
  year: z.number().min(2000, 'Invalid year').max(new Date().getFullYear()),
  link: z.string().url('Invalid link'),
  name: z.string().min(1, 'Name is required'),
});

// Magazine Schema
export const magazineSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  link: z.string().url('Invalid link'),
});

// Test Schema
export const testSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  type: z.string().min(1, 'Type is required'),
  status: z.enum(['active', 'inactive']),
  noOfQuestions: z.number().min(1, 'Number of questions required'),
  duration: z.number().min(1, 'Duration required'),
  examLink: z.string().url('Invalid exam link'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
});

// Notification Schema
export const notificationSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  link: z.string().url().optional().or(z.literal('')),
});

// Running Notification Schema
export const runningNotificationSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  link: z.string().url().optional().or(z.literal('')),
});

// Team Photo Schema
export const teamPhotoSchema = z.object({
  academicYear: z.string().min(1, 'Academic year is required'),
});