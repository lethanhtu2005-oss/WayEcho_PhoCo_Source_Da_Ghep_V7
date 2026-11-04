import Link from "next/link";

export const metadata = {
  title: "Cổng Đối tác · WayEcho",
  description: "Không gian làm việc chung dành cho Doanh nghiệp, Hướng dẫn viên và Tình nguyện viên WayEcho."
};

const roles = [
  { id:"business", title:"Doanh nghiệp", subtitle:"Cơ sở dịch vụ & điểm đến", icon:"🏛️", href:"/business", detail:"Quản lý thông tin cơ sở, dịch vụ và dữ liệu tiếp cận; tiếp nhận phản hồi từ du khách.", tags:["Hồ sơ cơ sở","Dịch vụ & đặt chỗ","Thông tin tiếp cận"] },
  { id:"guide", title:"Hướng dẫn viên", subtitle:"Guide đồng hành", icon:"🧭", href:"/guide", detail:"Quản lý lịch đồng hành, ca hỗ trợ và thông tin cần thiết cho hành trình tiếp cận.", tags:["Lịch hoạt động","Ca đồng hành","Hồ sơ hỗ trợ"] },
  { id:"volunteer", title:"Tình nguyện viên", subtitle:"Cộng đồng hỗ trợ thực địa", icon:"🤝", href:"/volunteer", detail:"Theo dõi hoạt động tại trạm, yêu cầu hỗ trợ và thông tin rào cản tại khu vực.", tags:["Ca trực","Yêu cầu hỗ trợ","Báo cáo hiện trường"] }
];

export default function PartnerGateway() {
  return <main className="min-h-screen overflow-hidden bg-[#fffaf3] py-10 text-[#352016] sm:py-16">
    <div className="container-page relative">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#f8ae38]/20 blur-3xl"/>
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-64 h-56 w-56 rounded-full bg-[#d86927]/10 blur-3xl"/>
      <nav aria-label="Đường dẫn trang" className="relative mb-6 flex items-center gap-2 text-sm text-[#80634e]"><Link href="/" className="hover:text-[#b94f1e]">Trang chủ</Link><span>/</span><span className="font-semibold text-[#b94f1e]">Cổng Đối tác</span></nav>
      <header className="relative max-w-3xl">
        <span className="inline-flex rounded-full border border-[#f0d8b6] bg-white/80 px-4 py-2 text-xs font-extrabold tracking-[.16em] text-[#9a511c] shadow-sm">WAYECHO PARTNER NETWORK</span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">Một cổng kết nối.<br/><span className="text-[#c46b24]">Ba nhóm đối tác.</span></h1>
        <p className="mt-5 text-base leading-8 text-[#665044] sm:text-lg">Chọn đúng nhóm công việc để mở không gian làm việc tương ứng. Cổng này chỉ gồm ba phân hệ: Doanh nghiệp, Hướng dẫn viên và Tình nguyện viên.</p>
      </header>
      <section aria-label="Ba phân hệ đối tác" className="relative mt-10 grid gap-5 lg:grid-cols-3">
        {roles.map((role,index)=><article key={role.id} className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-[28px] border border-[#eedecb] bg-white/90 p-6 shadow-[0_16px_45px_rgba(53,32,22,.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#f8ae38] hover:shadow-[0_24px_55px_rgba(53,32,22,.14)] sm:p-7">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#f8ae38]/15 blur-2xl transition-transform group-hover:scale-125"/>
          <div className="relative flex items-center justify-between"><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff0d5] to-[#f8dfb6] text-3xl shadow-inner">{role.icon}</span><span className="rounded-full border border-[#f0d8b6] bg-[#fffaf3] px-3 py-1 text-xs font-bold text-[#875222]">0{index+1} / 03</span></div>
          <div className="relative mt-6"><p className="text-xs font-bold uppercase tracking-[.13em] text-[#b96b2d]">{role.subtitle}</p><h2 className="mt-2 text-2xl font-extrabold">{role.title}</h2><p className="mt-3 text-sm leading-7 text-[#70594a]">{role.detail}</p></div>
          <ul className="relative mt-5 flex flex-wrap gap-2">{role.tags.map(tag=><li key={tag} className="rounded-full bg-[#fff3e2] px-3 py-1.5 text-xs font-semibold text-[#875222]">{tag}</li>)}</ul>
          <Link href={role.href} className="relative mt-auto inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#f8ae38] to-[#ee982b] px-5 py-3 text-sm font-extrabold text-[#352016] shadow-[0_8px_20px_rgba(248,174,56,.3)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(248,174,56,.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b94f1e]">Vào phân hệ {role.title} <span aria-hidden="true" className="ml-2">→</span></Link>
        </article>)}
      </section>
      <section className="relative mt-10 flex flex-col justify-between gap-5 rounded-[26px] border border-[#ead6c1] bg-[#352016] p-6 text-[#fff4e8] shadow-xl sm:flex-row sm:items-center sm:p-8">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffd08a]">Điều phối nội bộ</p><h2 className="mt-2 text-2xl font-bold">Cổng Admin là không gian riêng</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#f0dfd0]">Quản trị viên và điều phối viên đối tác sử dụng cổng Admin riêng, không thuộc ba phân hệ đối tác.</p></div>
        <Link href="/admin" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl border border-[#ffd08a]/60 bg-white/10 px-5 py-3 text-sm font-bold text-[#ffe0a8] transition hover:bg-white/15">Cổng Admin · Điều phối đối tác →</Link>
      </section>
      <p className="relative mt-8 text-center text-xs leading-6 text-[#8b7564]">WayEcho là prototype phục vụ học tập. Các thao tác đặt dịch vụ, điều phối và thông tin đối tác trong bản demo chưa đại diện cho dịch vụ thương mại thực tế.</p>
    </div>
  </main>;
}
