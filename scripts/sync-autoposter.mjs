import fs from 'node:fs';
import path from 'node:path';

const ROOT_BLOG = path.resolve('blog');
const PUBLIC_BLOG = path.resolve('public/blog');
const ROOT_FEED = path.resolve('feed.xml');
const PUBLIC_FEED = path.resolve('public/feed.xml');

function fixPostHogSnippet(html) {
  return html.replaceAll('insertBefore(p,r);var u=e;', 'insertBefore(p,r));var u=e;');
}

function syncDir(srcDir, dstDir) {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(dstDir, { recursive: true });
  let count = 0;

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);

    if (entry.isDirectory()) {
      count += syncDir(srcPath, dstPath);
    } else if (entry.name.endsWith('.html')) {
      const content = fixPostHogSnippet(fs.readFileSync(srcPath, 'utf8'));
      const prev = fs.existsSync(dstPath) ? fs.readFileSync(dstPath, 'utf8') : null;
      if (content !== prev) {
        fs.writeFileSync(dstPath, content, 'utf8');
        count++;
      }
    } else {
      const buf = fs.readFileSync(srcPath);
      const prev = fs.existsSync(dstPath) ? fs.readFileSync(dstPath) : null;
      if (!prev || !buf.equals(prev)) {
        fs.writeFileSync(dstPath, buf);
        count++;
      }
    }
  }
  return count;
}

const syncedBlogFiles = syncDir(ROOT_BLOG, PUBLIC_BLOG);

if (fs.existsSync(ROOT_FEED)) {
  const feedBuf = fs.readFileSync(ROOT_FEED);
  const prevFeed = fs.existsSync(PUBLIC_FEED) ? fs.readFileSync(PUBLIC_FEED) : null;
  if (!prevFeed || !feedBuf.equals(prevFeed)) {
    fs.writeFileSync(PUBLIC_FEED, feedBuf);
  }
}

console.log(`[sync-autoposter] Synced ${syncedBlogFiles} file(s) from root blog/ -> public/blog/`);
