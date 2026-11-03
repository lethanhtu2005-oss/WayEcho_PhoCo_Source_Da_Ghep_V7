import test from "node:test";
import assert from "node:assert/strict";
import { soundTracks } from "../data/oldQuarterDiscovery.js";
import { SERVICE_CONFIG, filterByLevel, levelOptions } from "../data/serviceDiscovery.js";

test("3 track âm thanh mô tả, id không trùng", () => {
  assert.equal(soundTracks.length, 3);
  assert.equal(new Set(soundTracks.map((t) => t.id)).size, 3);
});
test("mỗi nhóm dịch vụ có cấu hình riêng", () => {
  const ids = ["destination", "accommodation", "restaurant", "activity", "ticket", "transport"];
  assert.deepEqual(Object.keys(SERVICE_CONFIG).sort(), ids.sort());
  assert.equal(new Set(ids.map((i) => SERVICE_CONFIG[i].title)).size, 6);
  assert.ok(ids.every((i) => SERVICE_CONFIG[i].ask.length === 3 && SERVICE_CONFIG[i].actions.length >= 2));
});
test("lọc theo mức độ tiếp cận", () => {
  const items = [{ level: "A" }, { level: "B" }, { level: "A" }];
  assert.deepEqual(levelOptions(items), ["A", "B"]);
  assert.equal(filterByLevel(items, "A").length, 2);
  assert.equal(filterByLevel(items).length, 3);
});
