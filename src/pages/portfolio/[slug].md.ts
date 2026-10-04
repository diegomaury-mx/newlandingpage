// Version Markdown de la ficha de caso (ver src/pages/portfolio/[slug].astro,
// la version HTML). Un caso nuevo publicado obtiene su .md automaticamente,
// sin gate por canal ni por capa: el filtro de que fichas se ENLAZAN desde
// /llms.txt vive solo en llms.txt.ts, no aqui.
import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from '../../utils/slug.ts';
import { caseMarkdown } from '../../utils/caseMarkdown.ts';
import { mdResponse } from '../../utils/markdownDocs.ts';

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
  return mdResponse(caseMarkdown(props.entry.data, 'es'));
};
