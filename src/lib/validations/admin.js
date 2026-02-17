import { z } from "zod";

// Helper for optional string fields that can be null, undefined, or empty string
const optionalString = () => z.string().optional().nullable().or(z.literal(""));
const optionalUrl = () =>
  z.string().url("Invalid URL").optional().nullable().or(z.literal(""));

// ============================================
// CORE MEMBER SCHEMAS
// ============================================

export const coreMemberSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  academicYear: z.string().min(1, "Academic year is required"),
  sectionBranch: z.string().min(1, "Section/Branch is required"),
  portfolio: z.string().min(1, "Portfolio is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  category: z.string().min(1, "Category is required"),
  teamCategory: optionalString(),
  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .nullable()
    .or(z.literal("")),
  memberShipId: optionalString(),
});

// ============================================
// EVENT SCHEMAS
// ============================================

export const eventSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eventType: optionalString(),
  aboutEvent: optionalString(),
  eventRegistrationLink: optionalUrl(),
  eventPdfLink: optionalUrl(),
  eventVideoLink: optionalUrl(),
  noOfParticipants: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      return val;
    },
    z.coerce
      .number()
      .int()
      .min(0, "Number must be positive")
      .optional(),
  ),
  eventDate: z.string().min(1, "Event date is required"),
  eventHighlights: z.array(z.string()).default([]),
  studentCoordinators: z.array(z.string()).default([]),
  facultyCoordinators: z.array(z.string()).default([]),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"], {
    required_error: "Status is required",
  }),
  speakerName: optionalString(),
  speakerDescription: optionalString(),
  speakerHighlights: z.array(z.string()).default([]),
});

// ============================================
// TEXTBOOK SCHEMAS
// ============================================

export const textbookSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name is too long"),
  description: optionalString(),
  subject: z.string().min(1, "Subject is required"),
  category: optionalString(),
  author: z
    .string()
    .min(2, "Author name must be at least 2 characters")
    .max(100, "Author name is too long"),
  link: z.string().url("Invalid URL"),
});

// ============================================
// TEST SCHEMAS
// ============================================

export const testSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  subject: z.string().min(1, "Subject is required"),
  type: z.string().min(1, "Type is required"),
  status: z.enum(["upcoming", "active", "completed", "cancelled"], {
    required_error: "Status is required",
  }),
  noOfQuestions: z.coerce
    .number()
    .int()
    .min(1, "Must have at least 1 question"),
  duration: z.coerce
    .number()
    .int()
    .min(1, "Duration must be at least 1 minute"),
  examLink: z.string().url("Invalid URL"),
  date: z.string().min(1, "Date is required"),
  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .nullable()
    .or(z.literal("")),
});

// ============================================
// VLSI MATERIAL SCHEMAS
// ============================================

export const vlsiMaterialSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name is too long"),
  category: z.string().min(1, "Category is required"),
  link: z.string().url("Invalid URL"),
});

// ============================================
// TEAM PHOTO SCHEMAS
// ============================================

export const teamPhotoSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
});

// ============================================
// QUESTION BANK SCHEMAS
// ============================================

export const questionBankSchema = z.object({
  topicName: z
    .string()
    .min(3, "Topic name must be at least 3 characters")
    .max(200, "Topic name is too long"),
  subject: z.string().min(1, "Subject is required"),
  category: z.string().optional().nullable().or(z.literal("")),
  link: z.string().url("Invalid URL"),
});

// ============================================
// PLACEMENT PREP SCHEMAS
// ============================================

export const placementPrepSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name is too long"),
  category: z.string().optional().nullable().or(z.literal("")),
  link: z.string().url("Invalid URL"),
});

// ============================================
// RUNNING NOTIFICATION SCHEMAS
// ============================================

export const runningNotificationSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message is too long"),
  link: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
});

// ============================================
// NPTEL LECTURE SCHEMAS
// ============================================

export const nptelLectureSchema = z.object({
  courseName: z
    .string()
    .min(3, "Course name must be at least 3 characters")
    .max(200, "Course name is too long"),
  professorName: z
    .string()
    .min(2, "Professor name must be at least 2 characters")
    .max(100, "Professor name is too long"),
  category: z.string().optional().nullable().or(z.literal("")),
  link: z.string().url("Invalid URL"),
});

// ============================================
// PHOTO GALLERY SCHEMAS
// ============================================

export const photoGallerySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .nullable()
    .or(z.literal("")),
  category: z.enum(["CLUB_HIGHLIGHTS", "PHOTO_GALLERY", "BOTH"], {
    required_error: "Please select a category",
  }),
  priority: z.coerce
    .number()
    .int()
    .min(0, "Priority must be positive")
    .optional(),
});

// ============================================
// USER SCHEMAS
// ============================================

export const userSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"], {
    required_error: "Please select a role",
  }),
  year: z.string().optional().nullable().or(z.literal("")),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
});

// ============================================
// MAGAZINE SCHEMAS
// ============================================

export const magazineSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  category: z.string().optional().nullable().or(z.literal("")),
  link: z.string().url("Invalid URL"),
});

// ============================================
// PROJECT SCHEMAS
// ============================================

export const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  status: z.enum(["ongoing", "completed", "paused", "cancelled"], {
    required_error: "Status is required",
  }),
  Introduction: z
    .string()
    .min(20, "Introduction must be at least 20 characters"),
  academicYear: z.string().min(1, "Academic year is required"),
  Mentor: z
    .string()
    .min(2, "Mentor name must be at least 2 characters")
    .max(100, "Mentor name is too long"),
  category: z.string().min(1, "Category is required"),
  Members: z.array(z.string()).default([]),
  Statement: z.string().optional().nullable().or(z.literal("")),
  Abstract: z.string().optional().nullable().or(z.literal("")),
  Conclusion: z.string().min(20, "Conclusion must be at least 20 characters"),
  // Make Conclusion optional: allow empty string or null, but if provided keep min length
  Conclusion: z
    .string()
    .min(20, "Conclusion must be at least 20 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  Results: z.string().optional().nullable().or(z.literal("")),
  futureScope: z.string().optional().nullable().or(z.literal("")),
  referenceLinks: z.array(z.string()).default([]),
  Tools: z.array(z.string()).default([]),
  Link: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  createdBy: z.string().optional().nullable().or(z.literal("")),
  startDate: z.string().optional().nullable().or(z.literal("")),
  endDate: z.string().optional().nullable().or(z.literal("")),
  Methodology: z.string().optional().nullable().or(z.literal("")),
});

// ============================================
// GATE PYQ SCHEMAS
// ============================================

export const gatePyqSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(1990, "Invalid year")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  link: z.string().url("Invalid URL"),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name is too long"),
  category: z.string().optional().nullable().or(z.literal("")),
});

// ============================================
// ANNOUNCEMENT SCHEMAS
// ============================================

export const announcementSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z
    .string()
    .min(2, "Venue must be at least 2 characters")
    .max(200, "Venue is too long"),
  priority: z.coerce
    .number()
    .int()
    .min(0, "Priority must be positive")
    .optional(),
  isActive: z.boolean().optional().default(true),
});

// ============================================
// ACHIEVEMENT SCHEMAS
// ============================================

export const achievementSchema = z.object({
  type: z.enum(
    [
      "HERO_CAROUSEL",
      "CLUB_MILESTONE",
      "SUMMARY_STAT",
      "PROUD_MOMENT",
      "AWARD_HIGHLIGHT",
      "GALLERY_IMAGE",
    ],
    {
      required_error: "Type is required",
    },
  ),
  title: z
    .string()
    .max(500, "Title is too long")
    .optional()
    .nullable()
    .or(z.literal("")),
  description: z
    .string()
    .max(2000, "Description is too long")
    .optional()
    .or(z.literal("")),
  value: z
    .string()
    .max(50, "Value is too long")
    .optional()
    .nullable()
    .or(z.literal("")),
  priority: z.coerce
    .number()
    .int()
    .min(0, "Priority must be positive")
    .optional(),
  isActive: z.boolean().optional().default(true),
});

// ============================================
// MILESTONE SCHEMAS
// ============================================

export const milestoneSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
  date: z.string().min(1, "Date is required"),
  icon: z.string().optional().nullable().or(z.literal("")),
  color: z.string().optional().or(z.literal("bg-blue-500")),
  bgColor: z.string().optional().or(z.literal("bg-blue-50")),
  category: z.string().optional().or(z.literal("general")),
  priority: z.coerce
    .number()
    .int()
    .min(0, "Priority must be positive")
    .optional(),
  isActive: z.boolean().optional().default(true),
});

// ============================================
// NOTIFICATION SCHEMAS
// ============================================

export const notificationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
  link: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
  priority: z.coerce
    .number()
    .int()
    .min(0, "Priority must be positive")
    .optional(),
});

// ============================================
// CLUB MEMBER SCHEMAS
// ============================================

export const clubMemberSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  academicYear: z.string().min(1, "Academic year is required"),
  sectionBranch: z.string().min(1, "Section/Branch is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  memberShipId: z.string().optional().nullable().or(z.literal("")),
});
