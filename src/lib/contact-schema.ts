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

type Messages = { name: string; email: string; projectType: string; budget: string; message: string };

/** Built per language so validation messages match the visitor's language. */
export const makeContactSchema = (m: Messages) =>
  z.object({
    name: z.string().trim().min(2, m.name),
    email: z.string().trim().email(m.email),
    projectType: z.enum(projectTypes, { message: m.projectType }),
    budget: z.enum(budgets, { message: m.budget }),
    message: z.string().trim().min(20, m.message).max(4000),
    // Honeypot: real users never fill this.
    company: z.string().max(0).optional(),
  });

export const contactSchema = makeContactSchema({
  name: 'Please tell me your name',
  email: 'That email looks off',
  projectType: 'Pick a project type',
  budget: 'Pick a budget range',
  message: 'A little more detail helps (20+ characters)',
});

export type ContactInput = z.infer<typeof contactSchema>;
