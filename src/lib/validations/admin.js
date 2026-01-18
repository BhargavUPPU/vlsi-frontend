// Team Photo Schema
export const teamPhotoSchema = z.object({
  academicYear: z.string().min(1, 'Academic year is required'),
});

// Photo Gallery Schema
export const photoGallerySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional().or(z.literal('')),
  category: z.enum(['CLUB_HIGHLIGHTS', 'PHOTO_GALLERY', 'BOTH'], {
    required_error: 'Please select a category'
  }),
  priority: z.coerce.number().int().min(0, 'Priority must be positive').optional(),
});

// User Schema
export const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['USER', 'ADMIN', 'SUPERADMIN'], {
    required_error: 'Please select a role'
  }),
  year: z.string().optional(),
});