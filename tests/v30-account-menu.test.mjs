import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const header = await readFile(new URL('../components/Header.jsx', import.meta.url),'utf8');

test('V30 Header bell appears before user avatar and menu opens from avatar', () => {
  assert.ok(header.indexOf('href="/notifications"') < header.indexOf('aria-label="Tài khoản khách hàng"'));
  assert.match(header, /aria-expanded=\{account\}/);
  assert.match(header, /aria-controls="we-account-dropdown"/);
  assert.match(header, /aria-haspopup="true"/);
  assert.match(header, /setAccount\(!account\)/);
  assert.match(header, /event\.key === "Escape"/);
});

test('V30 user dropdown is for customers only; Partner and internal login are separate', async () => {
  for(const p of ['/login','/profile','/my-booking','/my-trip']) {
    assert.match(header,new RegExp(`href="${p}"`));
  }
  assert.doesNotMatch(header, /href="\/partner\/login"/);
  assert.doesNotMatch(header, /href="\/internal\/login"/);
  assert.match(header, /fetch\("\/api\/auth\/session"/);
  assert.match(header, /fetch\("\/api\/auth\/logout"/);
  assert.match(header, /guest/);
  assert.match(header, /Đăng nhập khách hàng/);
  const navSection = header.match(/\{label:"Đối tác"[^\n]+/);
  assert.ok(navSection && navSection[0].includes('"/partner/login"'));
  const loginForm=await readFile(new URL('../components/LoginForm.jsx', import.meta.url),'utf8');
  const customerLogin=await readFile(new URL('../app/login/page.jsx', import.meta.url),'utf8');
  assert.match(customerLogin, /portal="traveler"/);
  assert.match(loginForm, /portal === "traveler" \? \["traveler"\]/);
  assert.match(loginForm, /body\.role !== "traveler"/);
  for(const file of ['../app/login/page.jsx','../app/partner/login/page.jsx','../app/internal/login/page.jsx','../app/notifications/page.jsx']) {
    const content=await readFile(new URL(file,import.meta.url),'utf8');
    assert.ok(content.length>50,`${file} missing`);
  }
});

test('V30 service menu uses real category and ride booking routes', async()=>{
  assert.match(header, /Tour & Trải nghiệm","\/explore\?cat=activity/);
  assert.match(header, /Di chuyển","\/services\/ride-booking/);
});


test('V30 bell reads notifications for the current role rather than traveler-only', async () => {
 const page=await readFile(new URL('../app/notifications/page.jsx',import.meta.url),'utf8');
 const api=await readFile(new URL('../app/api/notifications/route.js',import.meta.url),'utf8');
 assert.match(page,/api\.listNotifications\(\)/);
 assert.match(api,/\["traveler","business","guide","admin","advisor"\]/);
});
