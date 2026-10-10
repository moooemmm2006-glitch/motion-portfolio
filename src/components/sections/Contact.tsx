'use client';

import dynamic from 'next/dynamic';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { site } from '@/data/site';
import { t } from '@/data/dictionary';
import { budgets, contactSchema, projectTypes, type ContactInput } from '@/lib/contact-schema';
import { useCanUse3D } from '@/hooks/useCanUse3D';
import { useInView } from '@/hooks/useInView';
import { Magnetic } from '@/components/ui/Magnetic';
import { SplitText } from '@/components/ui/SplitText';
import { expoOut } from '@/lib/easing';
import { cn } from '@/lib/utils';

const ContactScene = dynamic(() => import('@/components/three/ContactScene'), { ssr: false });

const field =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-paper placeholder:text-paper/30 outline-none transition-colors focus:border-violet-soft/70 focus:bg-white/[0.05]';

function Field({ label, error, children, id }: { label: string; error?: string; children: React.ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block text-[10px]">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            className="mt-2 text-xs text-ember"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  const can3D = useCanUse3D();
  const section = useRef<HTMLElement>(null);
  const near = useInView(section, '200px');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
      reset();
    } catch {
      setStatus('error');
    }
  };

  const wa = `https://wa.me/${site.whatsapp.replace(/\D/g, '')}`;

  return (
    <section ref={section} id="contact" className="relative isolate overflow-hidden py-28 md:py-40" aria-labelledby="contact-title">
      <div className="absolute inset-0 -z-10" aria-hidden>
        {can3D && near ? (
          <ContactScene active={near} />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(123,92,255,0.35),transparent_60%),radial-gradient(ellipse_at_80%_40%,rgba(255,107,61,0.2),transparent_55%)]" />
        )}
      </div>

      <div className="container-x">
        <p className="eyebrow mb-6">05 — {t.contact.eyebrow}</p>
        <h2 id="contact-title" className="display max-w-6xl text-[clamp(3rem,10vw,9.5rem)]">
          <SplitText text={t.contact.heading} by="words" />
        </h2>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-8">
            <p className="max-w-sm text-lg text-paper/70">
              Tell me about your project. I usually reply within 24 hours. {site.availability}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <a href={`mailto:${site.email}`} className="btn-primary">
                  ✉ {site.email}
                </a>
              </Magnetic>
              <Magnetic>
                <a href={wa} target="_blank" rel="noreferrer" className="btn-ghost">
                  WhatsApp ↗
                </a>
              </Magnetic>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/60">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-paper">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="glass grid gap-5 rounded-3xl p-6 md:grid-cols-2 md:p-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: expoOut }}
          >
            <Field id="name" label="Name" error={errors.name?.message}>
              <input id="name" autoComplete="name" className={field} placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} {...register('name')} />
            </Field>
            <Field id="email" label="Email" error={errors.email?.message}>
              <input id="email" type="email" autoComplete="email" className={field} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} {...register('email')} />
            </Field>
            <Field id="projectType" label="Project type" error={errors.projectType?.message}>
              <select id="projectType" className={cn(field, 'appearance-none')} defaultValue="" aria-invalid={!!errors.projectType} {...register('projectType')}>
                <option value="" disabled>
                  Select…
                </option>
                {projectTypes.map((p) => (
                  <option key={p} value={p} className="bg-ink">
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="budget" label="Budget range" error={errors.budget?.message}>
              <select id="budget" className={cn(field, 'appearance-none')} defaultValue="" aria-invalid={!!errors.budget} {...register('budget')}>
                <option value="" disabled>
                  Select…
                </option>
                {budgets.map((b) => (
                  <option key={b} value={b} className="bg-ink">
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field id="message" label="Message" error={errors.message?.message}>
                <textarea id="message" rows={5} className={cn(field, 'resize-none')} placeholder="What are we making? Timeline, references, deliverables…" aria-invalid={!!errors.message} {...register('message')} />
              </Field>
            </div>
            {/* honeypot */}
            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register('company')} />

            <div className="flex flex-wrap items-center gap-4 md:col-span-2">
              <Magnetic>
                <button type="submit" disabled={status === 'sending'} className="btn-primary relative px-8 py-4 disabled:opacity-70">
                  {status === 'sending' && (
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-violet-soft/60"
                      initial={{ width: '0%' }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 3, ease: 'easeOut' }}
                    />
                  )}
                  <span className="relative">{status === 'sending' ? t.contact.sending : t.contact.submit} →</span>
                </button>
              </Magnetic>
              <p role="status" className="text-sm">
                {status === 'sent' && <span className="text-violet-soft">{t.contact.sent}</span>}
                {status === 'error' && <span className="text-ember">{t.contact.error}</span>}
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
