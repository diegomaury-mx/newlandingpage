// Version /en/portfolio/{slug}.md — ver src/pages/portfolio/[slug].md.ts.
import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from '../../../utils/slug.ts';
import { caseMarkdown } from '../../../utils/caseMarkdown.ts';
import { mdResponse } from '../../../utils/markdownDocs.ts';

export const prerender = true;

export async function getStaticPaths() {
  const cases = await getCollection('cases');
  return cases
    .filter((c) => !c.data.draft)
    .map((entry) => ({ params: { slug: slugify(entry.data.title) }, props: { entry } }));
}

interface Props {
  entry: CollectionEntry<'cases'>;
}

export const GET: APIRoute<Props> = ({ props }) => {
  return mdResponse(caseMarkdown(props.entry.data, 'en'));
};
