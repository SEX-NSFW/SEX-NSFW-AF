import { cp, mkdir } from "node:fs/promises";

const output = ".vercel/output/static";

await mkdir(`${output}/css`, { recursive: true });
await mkdir(`${output}/js`, { recursive: true });
await cp("css/styles.css", `${output}/css/styles.css`);
await cp("js/app.js", `${output}/js/app.js`);
await cp("index.html", `${output}/index.html`);
await cp("favicon.svg", `${output}/favicon.svg`);

console.log("[build] copied legacy HTML/CSS/JS assets into .vercel/output/static");
