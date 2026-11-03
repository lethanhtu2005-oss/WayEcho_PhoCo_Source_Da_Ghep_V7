import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { changeEscrow, newEscrow } from "../lib/escrowServer.js";
const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");

test("incident freeze blocks a booking escrow before and after demo payment", () => {
  const booking = { id: "incident-booking", ownerId: "traveler-1", guideId: "guide-1", itemName: "Tour demo" };
  let row = newEscrow(booking);
  row = changeEscrow(row, "dispute", "traveler");
  assert.equal(row.status, "disputed");
  assert.throws(() => changeEscrow(row, "pay", "traveler"));
  row = changeEscrow(newEscrow(booking), "pay", "traveler");
  row = changeEscrow(row, "dispute", "traveler");
  assert.equal(row.dispute, true);
  assert.throws(() => changeEscrow(row, "customer_confirm", "traveler"));
});

test("partner demo login never posts credentials or redirects to protected portal", () => {
  const login = read("app/partner/login/page.jsx");
  const component = read("components/PartnerDemoLogin.jsx");
  assert.match(login, /PartnerDemoLogin/);
  assert.doesNotMatch(login, /LoginForm|password/i);
  assert.match(component, /window\.location\.assign\("\/partner\/demo\?"/);
  assert.match(component, /Không cần tài khoản hoặc mật khẩu/);
  assert.match(component, /không cấp quyền truy cập khu vực quản trị thật/);
});

test("booking review and incident actions stay linked to the selected booking", () => {
  const bookings = read("app/my-booking/page.jsx");
  const api = read("app/api/incidents/route.js");
  const review = read("app/api/reviews/route.js");
  assert.match(bookings, /BookingIncident booking=\{b\}/);
  assert.match(bookings, /booking=\$\{encodeURIComponent\(b\.id\)\}/);
  assert.match(api, /x\.id === body\.bookingId && x\.ownerId === user\.id/);
  assert.match(api, /changeEscrow\(escrow, "dispute", "traveler"\)/);
  assert.match(review, /booking\.itemId !== item\.id/);
});
