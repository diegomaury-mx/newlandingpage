import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const ids = [
  "213ea2d0-bffc-41b9-9877-92132551461c",
  "8dda9726-a42d-407d-ba84-334b4a1ef7a1",
];

for (const id of ids) {
  console.log(`\n=== ${id} ===`);

  try {
    const ds = await notion.dataSources.retrieve({
      data_source_id: id,
    });

    console.log("retrieve: OK");
    console.log(ds);
  } catch (e) {
    console.log("retrieve:", e.code, e.message);
  }

  try {
    const rows = await notion.dataSources.query({
      data_source_id: id,
      page_size: 1,
    });

    console.log("query: OK");
    console.log("results:", rows.results.length);
  } catch (e) {
    console.log("query:", e.code, e.message);
  }
}