import { z } from 'zod';

export const projectTypes = [
  'Video Editing',
  'Motion Graphics',
  'Logo Animation',
  'Color Grading',
  'VFX & Compositing',
  'Other',
] as const;

export const budgets = ['< $1k', '$1k – $3k', '$3k – $7k', '$7k – $15k', '$15k+'] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please tell me your name'),
  email: z.string().trim().email('That email looks off'),
  projectType: z.enum(projectTypes, { message: 'Pick a project type' }),
  budget: z.enum(budgets, { message: 'Pick a budget range' }),
  message: z.string().trim().min(20, 'A little more detail helps (20+ characters)').max(4000),
  // Honeypot: real users never fill this.
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
