import EscrowLedgerView from "@/components/EscrowLedgerView";
export const metadata = { title: "Ký quỹ Escrow (DEMO)" };
export default function AdminEscrow() {
  return <main className="container-page py-10"><h1 className="text-4xl">Ký quỹ Escrow</h1><p className="mt-3 max-w-3xl text-ink-soft">Sổ giao dịch ký quỹ mô phỏng: giữ, giải ngân, đóng băng khi có khiếu nại. Không có tiền thật.</p><div className="mt-6"><EscrowLedgerView role="admin" /></div></main>;
}
