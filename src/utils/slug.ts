/** Deriva un slug kebab-case de un titulo. `cases` no tiene un campo `Slug` propio en Notion. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}
