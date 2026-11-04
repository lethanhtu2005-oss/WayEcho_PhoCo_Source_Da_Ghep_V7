import test from 'node:test';
import assert from 'node:assert/strict';
import {honestAccessStatus} from '../lib/accessStatus.js';

test('honestAccessStatus: không khẳng định "đã khảo sát" khi chưa có xác minh', () => {
  assert.equal(honestAccessStatus('Đã khảo sát thực địa — Có lối dốc.'), 'Mô tả tham khảo, chưa xác minh tại chỗ — Có lối dốc.');
  assert.equal(honestAccessStatus('Đã khảo sát — Ngõ hẹp.'), 'Mô tả tham khảo, chưa xác minh tại chỗ — Ngõ hẹp.');
  assert.equal(honestAccessStatus('Vỉa hè hẹp.'), 'Vỉa hè hẹp.');
  assert.equal(honestAccessStatus(undefined), '');
});

import {forViewer} from '../lib/permissions.js';

test('forViewer: business/guide không nhận ownerId, traveler/admin giữ nguyên', () => {
  const rec = {id: '1', ownerId: 'guest_x', status: 'pending'};
  assert.deepEqual(forViewer({role: 'business'}, rec), {id: '1', status: 'pending'});
  assert.deepEqual(forViewer({role: 'guide'}, [rec]), [{id: '1', status: 'pending'}]);
  assert.equal(forViewer({role: 'admin'}, rec).ownerId, 'guest_x');
  assert.equal(forViewer({role: 'traveler'}, rec).ownerId, 'guest_x');
});
