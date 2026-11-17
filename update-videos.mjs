import { writeFile } from "node:fs/promises";

const CHANNEL_ID = "UCh04G1k7hhC_lRAXojn2QRQ";
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const xml = await (await fetch(FEED)).text();

const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, block]) => {
  const get = (tag) =>
    decode(block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1] ?? "");
  const id = get("yt:videoId");
  return {
    id,
    title: get("title"),
    url: `https://youtu.be/${id}`,
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    published: get("published"),
  };
});

await writeFile("videos.json", JSON.stringify(videos, null, 2) + "\n");
console.log(`Saved ${videos.length} videos`);
