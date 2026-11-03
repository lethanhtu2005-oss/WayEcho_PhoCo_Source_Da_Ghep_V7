"use client";
import EscrowLedgerView from "@/components/EscrowLedgerView";
export default function GuideBookings(){return <main className="container-page py-10"><h1 className="text-4xl">Lịch và giao dịch được phân công</h1><p className="mt-3 text-ink-soft">Chỉ hiển thị giao dịch gắn với định danh HDV của tài khoản hiện tại. Dữ liệu demo, chưa có lịch và thanh toán thực tế.</p><EscrowLedgerView role="guide" /></main>}
