/**
 * Astro Content Collections — Schema Definitions
 *
 * Sprint 0.5: Domain model only. No pages, routes, or components.
 * Sprint 1: This file activates when Astro is initialized (`npm create astro`).
 *
 * Requires: astro@^4.0.0
 * All date fields use ISO 8601 string format (e.g. "2024-03-15").
 * All slug references use kebab-case filenames without extension.
 */

import { defineCollection, z } from 'astro:content';

// ─── Case Study ──────────────────────────────────────────────────────────────

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    organization: z.string(),
    industry: z.string(),
    role: z.string(),
    period: z.object({
      start: z.string(),
      end: z.string().optional(), // omit if ongoing
    }),
    context: z.string(),
    challenge: z.string(),
    objectives: z.array(z.string()).min(1),
    constraints: z.array(z.string()).optional(),
    actions: z.array(z.string()).min(3),
    results: z.array(z.string()).min(1),
    metrics: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        delta: z.string().optional(), // e.g. "+600%", "-40%"
      })
    ).min(1),
    lessonsLearned: z.array(z.string()).optional(),
    relatedPlaybooks: z.array(z.string()).optional(), // slugs
    relatedServices: z.array(z.string()).optional(),  // slugs
    gallery: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
    ).optional(),
    testimonial: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
      organization: z.string(),
    }).optional(),
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
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
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
  projects,
  playbooks,
  insights,
  services,
};
