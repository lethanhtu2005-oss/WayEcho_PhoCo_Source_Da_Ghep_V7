import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('V31: Admin portal is absent from every public Header navigation surface', async () => {
  const header = await read('../components/Header.jsx');
  assert.doesNotMatch(header, /href=["']\/admin(?:["'?#]|$)/);
  assert.doesNotMatch(header, /Quản trị Admin|Admin Portal|Admin Demo/);
  assert.doesNotMatch(header, /requiredRole:\s*["']admin["']/);
  assert.doesNotMatch(header, /admin:\s*["']\/admin/);
  assert.doesNotMatch(header, /session\.role!==["']admin["']/);
  assert.match(header, /const nav =/);
  assert.match(header, /id="we-mobile-nav"/);
  assert.match(header, /aria-controls="we-mobile-nav"/);
});

test('V31: Admin access remains in the Footer, not in public navigation', async () => {
  const header = await read('../components/Header.jsx');
  const footer = await read('../components/Footer.jsx');
  assert.doesNotMatch(header, /href=["']\/admin/);
  assert.match(footer, /href=["']\/admin["']/);
  assert.match(footer, /Cổng Quản trị Admin/);
  for (const route of ['/partner', '/business', '/guide', '/volunteer']) {
    assert.ok(footer.includes(`href="${route}"`), `Footer missing ${route}`);
  }
});

test('V31: optimized WebP illustrations are referenced by destination and blog data', async () => {
  const destinations = await read('../data/destinations.js');
  const blogs = await read('../data/oldQuarterBlogs.js');
  assert.match(destinations, /hoang-thanh-thang-long-ai\.webp/);
  for (const name of [
    'nha-co-87-ma-may-ai',
    'cho-dong-xuan-ai',
    'o-quan-chuong-ai',
    'pho-hang-ma-ai',
  ]) {
    assert.ok(blogs.includes(`${name}.webp`), `Blog data does not reference ${name}.webp`);
  }
  for (const name of [
    'nha-co-87-ma-may-ai',
    'cho-dong-xuan-ai',
    'o-quan-chuong-ai',
    'pho-hang-ma-ai',
    'hoang-thanh-thang-long-ai',
  ]) {
    const asset = new URL(`../public/assets/images/${name}.webp`, import.meta.url);
    const info = await stat(asset);
    assert.ok(info.size > 0, `Missing or empty optimized asset: ${name}.webp`);
  }
});
