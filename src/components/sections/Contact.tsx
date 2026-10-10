'use client';

import dynamic from 'next/dynamic';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { openWhatsApp, site, whatsappUrl } from '@/data/site';
import { useContent, useLang } from '@/components/providers/LangProvider';
import { budgets, makeContactSchema, projectTypes, type ContactInput } from '@/lib/contact-schema';
import { useCanUse3D } from '@/hooks/useCanUse3D';
import { useInView } from '@/hooks/useInView';
import { Magnetic } from '@/components/ui/Magnetic';
import { SplitText } from '@/components/ui/SplitText';
import { expoOut } from '@/lib/easing';
import { cn } from '@/lib/utils';
import { SocialIcons, WhatsAppIcon, WhatsAppLink } from '@/components/ui/Brand';
import { GlassSelect } from '@/components/ui/GlassSelect';

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
  const { t, lang } = useLang();
  const { profile, projectType: typeLabel, budget: budgetLabel } = useContent();
  const schema = useMemo(() => makeContactSchema(t.contact.errors), [t]);
  const section = useRef<HTMLElement>(null);
  const near = useInView(section, '200px');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(schema) });

  // The form hands everything to WhatsApp as one prefilled message.
  const onSubmit = (data: ContactInput) => {
    const text = [
      `${t.contact.wa.hi} ${data.name}.`,
      `${t.contact.wa.email}: ${data.email}`,
      `${t.contact.wa.type}: ${typeLabel(data.projectType)}`,
      `${t.contact.wa.budget}: ${budgetLabel(data.budget)}`,
      '',
      data.message,
    ].join('\n');
    if (!openWhatsApp(text)) {
      const url = whatsappUrl(text);
      const win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url;
    }
    setStatus('sent');
    reset();
  };


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
        <p className="eyebrow mb-6">04 — {t.contact.eyebrow}</p>
        <h2 id="contact-title" className="display max-w-6xl text-[clamp(3rem,10vw,9.5rem)]">
          <SplitText key={lang} text={t.contact.heading} by="words" />
        </h2>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-8">
            <p className="max-w-sm text-lg text-paper/70">
              {t.contact.intro} {profile.availability}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <WhatsAppLink className="btn-primary" label={<>WhatsApp · <bdi dir="ltr">{site.phoneDisplay}</bdi></>} text={t.waGreeting} />
              </Magnetic>
            </div>
            <SocialIcons />
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
            <Field id="name" label={t.contact.fields.name} error={errors.name?.message}>
              <input id="name" autoComplete="name" className={field} placeholder={t.contact.placeholders.name} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} {...register('name')} />
            </Field>
            <Field id="email" label={t.contact.fields.email} error={errors.email?.message}>
              <input id="email" type="email" autoComplete="email" className={field} placeholder={t.contact.placeholders.email} dir="ltr" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} {...register('email')} />
            </Field>
            <Field id="projectType" label={t.contact.fields.projectType} error={errors.projectType?.message}>
              <Controller
                name="projectType"
                control={control}
                render={({ field: f }) => (
                  <GlassSelect
                    id="projectType"
                    value={f.value}
                    onChange={f.onChange}
                    onBlur={f.onBlur}
                    options={projectTypes.map((v) => ({ value: v, label: typeLabel(v) }))}
                    placeholder={t.contact.placeholders.select}
                    invalid={!!errors.projectType}
                    className={field}
                  />
                )}
              />
            </Field>
            <Field id="budget" label={t.contact.fields.budget} error={errors.budget?.message}>
              <Controller
                name="budget"
                control={control}
                render={({ field: f }) => (
                  <GlassSelect
                    id="budget"
                    value={f.value}
                    onChange={f.onChange}
                    onBlur={f.onBlur}
                    options={budgets.map((v) => ({ value: v, label: budgetLabel(v) }))}
                    placeholder={t.contact.placeholders.select}
                    invalid={!!errors.budget}
                    className={field}
                  />
                )}
              />
            </Field>
            <div className="md:col-span-2">
              <Field id="message" label={t.contact.fields.message} error={errors.message?.message}>
                <textarea id="message" rows={5} className={cn(field, 'resize-none')} placeholder={t.contact.placeholders.message} aria-invalid={!!errors.message} {...register('message')} />
              </Field>
            </div>
            {/* honeypot */}
            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register('company')} />

            <div className="flex flex-wrap items-center gap-4 md:col-span-2">
              <Magnetic>
                <button type="submit" disabled={status === 'sending'} className="btn-primary relative px-8 py-4 disabled:opacity-70">
                  {status === 'sending' && (
                    <motion.span
                      className="absolute inset-y-0 start-0 bg-violet-soft/60"
                      initial={{ width: '0%' }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 3, ease: 'easeOut' }}
                    />
                  )}
                  <span className="relative inline-flex items-center gap-2">
                    <WhatsAppIcon className="text-[#25D366]" />
                    {status === 'sending' ? t.contact.sending : t.contact.submit} {t.contact.arrow}
                  </span>
                </button>
              </Magnetic>
              <p role="status" className="text-sm">
                {status === 'sent' && <span className="text-violet-soft">{t.contact.sent}</span>}
                              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
