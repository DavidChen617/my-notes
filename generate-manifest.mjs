import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

async function listFiles(dir, root) {
  const items = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()){
      items.push(...await listFiles(fullPath, root));
    }
    else if (entry.isFile() && entry.name.endsWith('.md')) {
      const copy = entry.parentPath.split('/');
      copy.shift();

      items.push({
        name: entry.name,
        parentPath: copy.join('/')
      });
    }
  }

  return items;
}

const wrapper = {};
const handle = (items) => {
  wrapper.items = items;
  writeFile("public/manifest.json", JSON.stringify(wrapper, null, 2), "utf8").catch(console.error);
}

listFiles('public/notes', 'notes')
  .then(handle)
  .catch(console.error);
