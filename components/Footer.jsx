"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {isInternalPortalPath} from "@/lib/portalRoutes";
import Logo from "./Logo";

const footerLink = "inline-flex min-h-11 items-center rounded-md text-sm text-[#f2e4d8] hover:text-[#ffd08a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcf7c]";
const sections = [
  {label:"Khám phá", links:[["Điểm đến Phố cổ","/destination"],["Dịch vụ du lịch","/explore"],["Blog & Trải nghiệm","/articles"],["Bản đồ & vị trí","/navigation"],["Đặt xe (mô phỏng)","/services/ride-booking"]]},
  {label:"Hỗ trợ", links:[["Trung tâm trợ giúp","/help"],["Hướng dẫn tương tác","/onboarding"],["Tuyên bố tiếp cận","/accessibility"],["Liên hệ WayEcho","/contact"],["SOS (mô phỏng)","/sos"]]},
  {label:"Dành cho đối tác", links:[["Đăng ký hợp tác","/partners/cooperate"],["Cổng Đối Tác Liên Thông","/partner"],["Hướng dẫn viên & TNV","/partners/guide"],["Doanh nghiệp","/partners/business"]]},
  {label:"Về WayEcho", links:[["Giới thiệu","/help"],["Quyền riêng tư","/privacy"],["Điều khoản sử dụng","/terms"],["Nguồn ảnh & giấy phép","/photo-credits"]]},
];

export default function Footer() {
  const pathname = usePathname();
  if (isInternalPortalPath(pathname)) return null;
  return <footer className="mt-0 bg-[#352016] text-[#fff2e7] print:hidden" aria-label="Chân trang WayEcho">
    <div className="container-page py-11 sm:py-14">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_repeat(4,minmax(0,1fr))] lg:gap-7">
        <section aria-labelledby="footer-brand" className="lg:pr-3">
          <h2 id="footer-brand" className="sr-only">WayEcho</h2>
          <Link href="/" aria-label="Về trang chủ WayEcho" className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcf7c]"><Logo dark height={34}/></Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-[#f2e4d8]">Du lịch tiếp cận – Khám phá Hà Nội theo cách của bạn.</p>
          <p className="mt-3 text-sm font-semibold text-[#ffd39a]">HEAR YOUR WAY</p>
        </section>
        {sections.map(s=><nav key={s.label} aria-label={s.label}>
          <h2 className="mb-2 text-base font-bold text-white">{s.label}</h2>
          <ul className="space-y-0">{s.links.map(([label,href])=><li key={href+label}>{href==="/partner"?<Link className={footerLink} href="/partner">{label}</Link>:<Link className={footerLink} href={href}>{label}</Link>}</li>)}</ul>
        </nav>)}
      </div>
      <div className="mt-9 border-t border-[#80604f] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#f2e4d8]">Liên hệ: <a className="underline decoration-[#e6af7e] underline-offset-4 hover:text-white" href="mailto:support@wayecho.vn">support@wayecho.vn</a> · 28 Hàng Buồm, Hà Nội (thông tin demo)</p>
          <p className="text-xs text-[#f2e4d8]">© 2026 WayEcho · Website mô phỏng phục vụ nghiên cứu</p>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#e8cbb5]">Thông tin liên hệ, dịch vụ trợ năng và đối tác trong prototype là dữ liệu minh họa, chưa xác minh hoạt động thực tế. SOS demo không tự liên hệ lực lượng cứu hộ.</p>
      </div>
    </div>
  </footer>;
}
