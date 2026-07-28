import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const res = await notion.search({
  filter: {
    property: "object",
    value: "data_source",
  },
  page_size: 100,
});

console.log(`Encontrados: ${res.results.length}\n`);

for (const ds of res.results) {
  console.log({
    id: ds.id,
    name: ds.name?.map(t => t.plain_text).join("") ?? "(sin nombre)",
  });
}