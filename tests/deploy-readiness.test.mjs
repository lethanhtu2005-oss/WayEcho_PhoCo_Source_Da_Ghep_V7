import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
const read = (p) => readFile(new URL("../" + p, import.meta.url), "utf8");

test("cấu hình deploy Vercel: header bảo mật, không còn output standalone, dev không mở ra mạng", async () => {
  const cfg = await read("next.config.mjs");
  for (const h of ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]) assert.match(cfg, new RegExp(h));
  assert.doesNotMatch(cfg, /standalone/);
  assert.match(cfg, /poweredByHeader:\s*false/);
  const pkg = JSON.parse(await read("package.json"));
  assert.doesNotMatch(pkg.scripts.dev, /0\.0\.0\.0/);
});
test("các liên kết điều hướng nội bộ trỏ tới route có thật (đối tác, admin escrow)", async () => {
  await access(new URL("../app/admin/escrow/page.jsx", import.meta.url));
  assert.match(await read("components/AdminNav.jsx"), /\/admin\/escrow/);
  const hub = await read("app/partner/page.jsx");
  assert.match(hub, /PartnerEnter/);
  assert.doesNotMatch(hub, /partner\/login/);
});
