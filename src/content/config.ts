/**
 * Astro Content Collections — Schema Definitions
 *
 * `cases`, `metrics` y `siteCopy` son las 3 colecciones del CMS de Notion
 * (Diego CMS): cargan datos en build vía Content Layer API (`loader:`),
 * validadas contra el contrato real en `docs/platform/notion-astro-contract.md`.
 * `projects`, `playbooks`, `insights` y `services` son colecciones de archivo
 * local, fuera del alcance de Diego CMS — sin tocar aquí.
 *
 * Requires: astro@^5.0.0 (Content Layer API estable)
 * All date fields use ISO 8601 string format (e.g. "2024-03-15").
 * All slug references use kebab-case filenames without extension.
 */

import { defineCollection, z } from 'astro:content';
import { casesLoader, metricsLoader, siteCopyLoader } from '../services/notionLoaders.ts';

// ─── Case Study (fuente: SSOT - Portafolio Proyectos) ─────────────────────────

const cases = defineCollection({
  loader: casesLoader,
  schema: z
    .object({
      title: z.string().min(1),
      // 12/27 fichas reales no tienen Organización y 11/27 no tienen Tipo
      // (fichas Draft/Archivo aún sin curar) — opcionales para no bloquear
      // el build entero por contenido en progreso que no se va a publicar.
      organization: z.string().optional(),
      type: z.string().optional(),
      role: z.string(),
      objective: z.string(),
      resultsAndActions: z.string(),
      quantData: z.string(),
      anchorMetric: z.string(),
      publicationStatus: z
        .enum(['Draft', 'En revisión', 'Publicado', 'Archivado'])
        .default('Draft'),
      publishable: z.boolean().default(false),
      layer: z.enum(['Insignia', 'Soporte', 'Archivo']),
      channels: z.array(z.enum(['Sitio', 'LinkedIn', 'CV', 'llms.txt'])).default([]),
      capabilities: z.array(z.string()).default([]),
      evidenceUrl: z.string().url().optional(),
      masterCase: z.array(z.string()).default([]),
      editions: z.array(z.string()).default([]),
      year: z.string().optional(),
      banner: z.string().optional(),
      logo: z.string().optional(),
      // draft = NOT (Estado publicación == "Publicado" AND Publicable == true)
      draft: z.boolean().default(true),
    })
    .superRefine((data, ctx) => {
      // Regla transversal del contrato: capa Insignia no puede publicarse
      // (draft = false) sin métrica ancla y evidencia verificadas.
      if (data.layer === 'Insignia' && !data.draft) {
        if (!data.anchorMetric.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['anchorMetric'],
            message: 'Ficha Insignia publicada sin Métrica ancla — bloquea el build.',
          });
        }
        if (!data.evidenceUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['evidenceUrl'],
            message: 'Ficha Insignia publicada sin Evidencia — bloquea el build.',
          });
        }
      }
    }),
});

// ─── Métricas oficiales (fuente: Métricas oficiales — Portafolio D) ───────────

const metrics = defineCollection({
  loader: metricsLoader,
  schema: z.object({
    metric: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'slug debe ser kebab-case'),
    value: z.string(),
    canonicalClaim: z.string(),
    mandatoryQualifier: z.string(),
    timeframe: z.string(),
    entity: z.string().optional(),
    allowedSurfaces: z
      .array(
        z.enum([
          'Hero',
          'Caso de estudio',
          'llms.txt',
          'CV',
          'Pitch deck',
          'LinkedIn',
          'Sitio web',
        ])
      )
      .default([]),
    status: z.enum(['Vigente', 'Condicionada', 'Retirada', 'En revisión']).optional(),
    publicability: z
      .enum(['Pública', 'Interna', 'A solicitud', 'No publicable'])
      .optional(),
    evidenceGrade: z.enum(['published', 'own']).optional(),
    reputationalRisk: z.enum(['Bajo', 'Medio', 'Alto']).optional(),
    evidenceUrl: z.string().url().optional(),
    source: z.string().optional(),
    usageNote: z.string().optional(),
    relatedCase: z.array(z.string()).default([]),
    // buildable = Estado == "Vigente" AND Publicabilidad IN [Pública, A solicitud]
    buildable: z.boolean(),
  }),
});

// ─── Copy Oficial (fuente: Copy Oficial · diegomaury.mx, singleton) ───────────

const siteCopy = defineCollection({
  loader: siteCopyLoader,
  schema: z.object({
    title: z.string(),
    markdown: z.string(),
  }),
});

// ─── Project ─────────────────────────────────────────────────────────────────

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    purpose: z.string(),
    description: z.string(),
    status: z.enum(['active', 'completed', 'paused', 'archived']),
    role: z.string(),
    timeline: z.object({
      start: z.string(),
      end: z.string().optional(),
    }),
    impact: z.string(),
    technologies: z.array(z.string()).optional(),
    relatedInsights: z.array(z.string()).optional(),  // slugs
    relatedPlaybooks: z.array(z.string()).optional(), // slugs
    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().max(160).optional(),
    ogImage: z.string().optional(),
    // Publishing
    publishedAt: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

// ─── Playbook ─────────────────────────────────────────────────────────────────

const playbooks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    problem: z.string(),
    framework: z.string(),
    steps: z.array(
      z.object({
        order: z.number(),
        title: z.string(),
        description: z.string(),
      })
    ).min(1),
    resources: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
        type: z.enum(['link', 'download', 'tool', 'template']),
      })
    ).optional(),
    downloads: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
        format: z.string(), // e.g. "PDF", "XLSX"
      })
    ).optional(),
    relatedCaseStudies: z.array(z.string()).optional(), // slugs
    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().max(160).optional(),
    ogImage: z.string().optional(),
    // Publishing
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

// ─── Insight ─────────────────────────────────────────────────────────────────

const insights = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.string(),
    readingTime: z.number().positive(), // minutes
    summary: z.string(),
    tags: z.array(z.string()).min(1),
    relatedTopics: z.array(z.string()).optional(),
    cta: z.object({
      label: z.string(),
      href: z.string(),
    }).optional(),
    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().max(160).optional(),
    ogImage: z.string().optional(),
    // Publishing
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

// ─── Service ─────────────────────────────────────────────────────────────────

const services = defineCollection({
  type: 'data', // structured data, not long-form MDX
  schema: z.object({
    name: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    tagline: z.string(),
    description: z.string(),
    deliverables: z.array(z.string()).min(1),
    timeline: z.string(), // e.g. "4–6 semanas"
    engagement: z.enum(['retainer', 'project', 'advisory']),
    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().max(160).optional(),
    // Ordering
    order: z.number().int().nonnegative(),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
  }),
});

// ─── Exports ─────────────────────────────────────────────────────────────────

export const collections = {
  cases,
  metrics,
  siteCopy,
  projects,
  playbooks,
  insights,
  services,
};
