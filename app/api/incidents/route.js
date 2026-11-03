import { secured, fail, json } from "@/lib/auth";
import { list, transaction, insert } from "@/lib/store";
import { readJson, cleanText } from "@/lib/validate";
import { changeEscrow } from "@/lib/escrowServer";
export const dynamic = "force-dynamic";

// Sự cố gắn trực tiếp với booking. Khi còn trạng thái có thể bảo vệ, Escrow demo bị đóng băng trong cùng transaction.
export const GET = secured(async () => json((await list("incidents")).map(({ ownerId: _ownerId, ...row }) => row)), ["admin"]);

export const POST = secured(async (req, user) => {
  const body = await readJson(req);
  if (!body || typeof body.bookingId !== "string" || typeof body.topic !== "string" || typeof body.detail !== "string") fail(400, "Thiếu thông tin sự cố.");
  const topics = ["safety", "guide", "service", "accessibility", "other"];
  if (!topics.includes(body.topic)) fail(400, "Loại sự cố không hợp lệ.");
  const detail = cleanText(body.detail, 1200);
  if (detail.length < 10) fail(400, "Mô tả sự cố cần ít nhất 10 ký tự.");
  const record = await transaction(db => {
    const booking = db.bookings.find(x => x.id === body.bookingId && x.ownerId === user.id);
    if (!booking) fail(404, "Không tìm thấy booking của bạn.");
    if (db.incidents.some(x => x.bookingId === booking.id && x.ownerId === user.id && x.status !== "closed")) fail(409, "Booking này đã có báo cáo sự cố đang được xử lý.");
    const escrow = db.escrow.find(x => x.bookingId === booking.id && x.ownerId === user.id);
    let frozen = false;
    if (escrow && ["awaiting_payment", "paid", "in_progress", "awaiting_confirmation"].includes(escrow.status)) {
      Object.assign(escrow, changeEscrow(escrow, "dispute", "traveler"));
      frozen = true;
    }
    const incident = insert(db, "incidents", { ownerId: user.id, bookingId: booking.id, itemName: booking.itemName, topic: body.topic, detail, status: "received", escrowFrozen: frozen, escrowId: escrow?.id || null });
    insert(db, "notifications", { ownerId: user.id, role: "admin", type: "incident", message: `Báo cáo sự cố mới cho booking ${booking.id}${frozen ? " — Escrow demo đã đóng băng" : ""}.` });
    insert(db, "notifications", { ownerId: user.id, role: "traveler", type: "incident_received", message: `Đã ghi nhận báo cáo sự cố cho “${booking.itemName}”. ${frozen ? "Escrow demo đã tạm dừng." : "Báo cáo đã được lưu để quản trị viên kiểm tra."}` });
    return incident;
  });
  return json({ id: record.id, status: record.status, escrowFrozen: record.escrowFrozen }, 201);
}, ["traveler"], { guest: true });

export const PATCH = secured(async (req) => {
  const body = await readJson(req);
  if (!body || typeof body.id !== "string" || !["reviewing", "closed"].includes(body.status)) fail(400, "Trạng thái xử lý không hợp lệ.");
  const record = await transaction(db => {
    const incident = db.incidents.find(x => x.id === body.id);
    if (!incident) fail(404, "Không tìm thấy báo cáo sự cố.");
    Object.assign(incident, { status: body.status, updatedAt: new Date().toISOString() });
    return incident;
  });
  const { ownerId: _ownerId, ...safe } = record;
  return json(safe);
}, ["admin"]);
