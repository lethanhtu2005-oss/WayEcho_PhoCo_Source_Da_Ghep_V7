import test from "node:test";
import assert from "node:assert/strict";
import { discoveryPlaces, filterDiscovery } from "../data/oldQuarterDiscovery.js";

test("6 điểm, ảnh không trùng", () => {
  assert.equal(discoveryPlaces.length, 6);
  assert.equal(new Set(discoveryPlaces.map((p) => p.image)).size, 6);
});
test("lọc theo loại và mức tiếp cận", () => {
  assert.equal(filterDiscovery(discoveryPlaces).length, 6);
  assert.ok(filterDiscovery(discoveryPlaces, "Tất cả", "assist").every((p) => p.level === "assist"));
  assert.equal(filterDiscovery(discoveryPlaces, "Chợ & ẩm thực", "good").length, 0);
});
test("mọi điểm có nhãn chưa xác minh trong ghi chú hoặc nhãn mức", () => {
  assert.ok(discoveryPlaces.every((p) => p.notes.length >= 1 && p.levelLabel));
});

import { soundTracks } from "../data/oldQuarterDiscovery.js";
test("3 track âm thanh mô tả, id không trùng", () => {
  assert.equal(soundTracks.length, 3);
  assert.equal(new Set(soundTracks.map((t) => t.id)).size, 3);
  assert.ok(soundTracks.every((t) => t.text.length > 40));
});
