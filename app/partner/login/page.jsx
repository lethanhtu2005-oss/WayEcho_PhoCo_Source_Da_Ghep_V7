import LoginForm from "@/components/LoginForm";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export const metadata = {
  title: "Đăng Nhập Cổng Đối Tác · WayEcho",
  robots: { index: false, follow: false }
};

export default function PartnerLogin() {
  return (
    <div className="container-page py-10 sm:py-14 max-w-xl mx-auto px-4">
      <div className="rounded-3xl border border-[#eddccc] bg-white p-6 sm:p-10 shadow-sm">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-xs uppercase tracking-wider text-[#c75c13]">WAYECHO · PARTNER PORTAL</p>
          <span className="rounded-full bg-[#fbfaf4] border border-[#ebd9c5] px-2.5 py-0.5 text-xs text-[#665b50]">
            Phân quyền máy chủ
          </span>
        </div>

        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[#352016]">
          Đăng Nhập Đối Tác
        </h1>

        <p className="mt-2 text-sm text-[#665b50] leading-relaxed">
          Khu vực dành cho Hướng dẫn viên, Tình nguyện viên và Doanh nghiệp tiếp cận Phố Cổ.
          Đăng nhập để vào dashboard làm việc hoặc quản lý ca trực thực địa.
        </p>

        {/* Quick Volunteer Shortcut */}
        <div className="mt-5 rounded-2xl bg-[#f0fdfa] border border-[#99f6e4] p-4 text-xs text-[#115e59]">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#0f766e]">🤝 Bạn là Tình nguyện viên?</span>
            <Link
              href="/volunteer"
              className="rounded-lg bg-[#0d9488] text-white px-3 py-1 font-bold hover:bg-[#0f766e] transition-colors"
            >
              Vào Trạm Trực Tiếp →
            </Link>
          </div>
          <p className="mt-1 text-[#134e4a]">
            Tình nguyện viên có thể vào ngay Trạm Điều Phối 28 Hàng Buồm để nhận ca đón khách và cập nhật rào cản mà không cần tài khoản doanh nghiệp.
          </p>
        </div>

        {/* Login form with role buttons */}
        <LoginForm portal="partner" />

        {/* Footer Navigation */}
        <div className="mt-6 pt-5 border-t border-[#f0e7dd] flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link className="font-semibold text-[#c75c13] hover:underline" href="/partner">
            ← Quay lại Cổng đối tác
          </Link>
          <div className="flex items-center gap-2">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
