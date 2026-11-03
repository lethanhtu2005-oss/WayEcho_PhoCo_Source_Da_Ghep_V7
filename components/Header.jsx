"use client";

import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {isInternalPortalPath} from "@/lib/portalRoutes";
import {useA11y} from "./A11yProvider";
import Logo from "./Logo";
import {AccessibleIcon, ContrastIcon, TextSizeIcon, SpeakerIcon, UserIcon, MenuIcon} from "./Icons";

const NAV = [
  {label:"Điểm đến",href:"/destination",links:[["Khám phá điểm đến","/destination"],["Tìm kiếm điểm đến","/search"],["Bản đồ du lịch","/navigation"]]},
  {label:"Dịch vụ",href:"/explore",links:[["Khám phá theo mức độ tiếp cận","/explore#kham-pha-tiep-can"],["Lưu trú","/explore?cat=accommodation"],["Ẩm thực","/explore?cat=restaurant"],["Di chuyển","/services/ride-booking"],["Guide đồng hành","/services/guides"],["Vé tham quan","/explore?cat=ticket"],["Tour & Trải nghiệm","/explore?cat=activity"],["Đặt dịch vụ","/booking"]]},
  {label:"Blog & Trải nghiệm",href:"/articles",links:[["Cẩm nang du lịch","/articles"],["Du lịch tiếp cận","/articles"],["Gợi ý hành trình","/articles"],["Câu chuyện trải nghiệm","/articles"],["Mẹo du lịch","/articles"]]},
  {label:"Hỗ trợ",href:"/help",links:[["Hồ sơ tiếp cận","/profile"],["Hướng dẫn tương tác","/onboarding"],["Hướng dẫn sử dụng","/help"],["Liên hệ hỗ trợ","/help#contact"],["SOS – hỗ trợ khẩn cấp","/sos"]]},
  {label:"Đối tác",href:"/partner",links:[["Cổng Partner","/partner"],["Đăng nhập đối tác","/partner/login"],["Dành cho doanh nghiệp","/partners/business"],["Trở thành Guide","/partners/guide"],["Hợp tác cùng WayEcho","/partners/cooperate"]]},
];

const ROLE_LABELS = {traveler:"Khách hàng",guide:"Hướng dẫn viên",business:"Đối tác doanh nghiệp",admin:"Quản trị viên",advisor:"Tư vấn viên"};
const ROLE_HOME = {traveler:"/profile",guide:"/guide",business:"/business",admin:"/admin",advisor:"/admin/consultation"};
const menuLink = "flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-[#452a1d] transition-colors hover:bg-[#fff0df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a94c1c]";

function Chevron() {
  return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>;
}
function BellIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/></svg>;
}

export default function Header() {
  const pathname = usePathname();
  const {contrast,largeText,toggleContrast,toggleLargeText,speak,stop} = useA11y();
  const [menu,setMenu] = useState(null);
  const [mobile,setMobile] = useState(false);
  const [access,setAccess] = useState(false);
  const [account,setAccount] = useState(false);
  const [session,setSession] = useState(null);
  const [sessionLoading,setSessionLoading] = useState(false);
  const [logoutBusy,setLogoutBusy] = useState(false);
  const [accountError,setAccountError] = useState("");
  const root = useRef(null);
  const userButtonRef = useRef(null);

  useEffect(() => {
    function outside(event) {
      if (root.current && !root.current.contains(event.target)) {
        setMenu(null);setAccess(false);setAccount(false);
      }
    }
    function key(event) {
      if (event.key === "Escape") {
        setMenu(null);setMobile(false);setAccess(false);
        setAccount(previous => {if (previous) userButtonRef.current?.focus(); return false;});
      }
    }
    document.addEventListener("pointerdown",outside);
    document.addEventListener("keydown",key);
    return () => {document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key);};
  }, []);

  useEffect(() => {
    if (!account) return;
    let cancelled = false;
    setSessionLoading(true);
    setAccountError("");
    fetch("/api/auth/session",{cache:"no-store"})
      .then(async response => response.ok ? response.json() : null)
      .then(data => {if (!cancelled) setSession(data);})
      .catch(() => {if (!cancelled) {setSession(null);setAccountError("Không kiểm tra được phiên. Có thể chọn đăng nhập lại.");}})
      .finally(() => {if (!cancelled) setSessionLoading(false);});
    return () => {cancelled = true;};
  }, [account]);

  if (isInternalPortalPath(pathname)) return null;
  const close = () => {setMenu(null);setMobile(false);setAccess(false);setAccount(false);};
  const authenticated = Boolean(session && !session.guest);

  async function logoutAccount() {
    setLogoutBusy(true);setAccountError("");
    try {
      const response = await fetch("/api/auth/logout",{method:"POST"});
      if (!response.ok) throw new Error("Chưa đăng xuất được. Vui lòng thử lại.");
      window.location.assign("/");
    } catch (error) {setAccountError(error.message || "Đăng xuất không thành công.");setLogoutBusy(false);}
  }

  const nav = <ul className="flex flex-col gap-1 xl:flex-row xl:items-center">
    {NAV.map((item,i) => <li key={item.label} className="relative">
      <button type="button" aria-expanded={menu===i} aria-controls={`we-menu-${i}`}
        onClick={() => {setMenu(menu===i?null:i);setAccess(false);setAccount(false);}}
        className={`we-nav-trigger flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-3 font-semibold hover:bg-[#fff1e1] focus-visible:outline-2 focus-visible:outline-orange-500 ${menu===i?"bg-[#ffeed9] text-[#ad481a]":""}`}>
        {item.label}<Chevron/>
      </button>
      {menu===i && <div id={`we-menu-${i}`} className="we-dropdown relative z-50 mt-1 min-w-[245px] rounded-2xl border border-[#e8dfd3] bg-white p-2 shadow-xl xl:absolute xl:left-0 xl:top-full xl:mt-2">
        <Link href={item.href} onClick={close} className="block rounded-xl px-4 py-3 font-bold hover:bg-[#fff3e3]">{item.label==="Blog & Trải nghiệm"?"Xem Blog & Trải nghiệm":item.label==="Dịch vụ"?"Xem các dịch vụ":"Xem tất cả"}</Link>
        {item.links.map(([name,href]) => <Link key={name} href={href} onClick={close} className="block rounded-xl px-4 py-3 text-sm hover:bg-[#fff3e3] focus-visible:outline-2 focus-visible:outline-orange-500">{name}</Link>)}
      </div>}
    </li>)}
  </ul>;

  return <header ref={root} className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur hc-surface hc-border">
    <div className="container-page flex min-h-[74px] items-center justify-between gap-2 py-2">
      <Link href="/" onClick={close} aria-label="WayEcho – trang chủ" className="shrink-0"><Logo height={31}/></Link>
      <nav aria-label="Điều hướng chính" className="hidden xl:block">{nav}</nav>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <div className="relative">
          <button type="button" aria-expanded={access} aria-controls="we-access" onClick={() => {setAccess(!access);setMenu(null);setAccount(false);}}
            className="flex min-h-11 items-center gap-2 rounded-full bg-[#ffb431] px-3 font-bold text-[#171717] hover:bg-[#ffca62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b4018]">
            <AccessibleIcon size={21}/><span className="hidden lg:inline">Trợ năng</span>
          </button>
          {access && <div id="we-access" className="absolute right-0 top-full z-50 mt-2 w-[min(320px,90vw)] rounded-2xl border border-line bg-white p-4 shadow-xl hc-surface hc-border">
            <h2 className="mb-3 font-bold">Hỗ trợ tiếp cận</h2>
            <button type="button" onClick={toggleContrast} aria-pressed={contrast} className="we-menu-action"><ContrastIcon size={18}/> Tương phản cao: {contrast?"Bật":"Tắt"}</button>
            <button type="button" onClick={toggleLargeText} aria-pressed={largeText} className="we-menu-action"><TextSizeIcon size={18}/> Chữ lớn: {largeText?"Bật":"Tắt"}</button>
            <button type="button" onClick={() => speak(document.getElementById("main")?.innerText?.slice(0,900)||"Không có nội dung")} className="we-menu-action"><SpeakerIcon size={18}/> Nghe nội dung trang</button>
            <button type="button" onClick={stop} className="we-menu-action">Dừng đọc</button>
          </div>}
        </div>
        {/* Thứ tự: Trợ năng -> Chuông thông báo -> Tài khoản khách hàng. */}
        <Link href="/notifications" onClick={close} aria-label="Xem thông báo" title="Thông báo"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-[#54260e] transition-colors hover:bg-[#fff1df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b94f1e] hc-border">
          <BellIcon/>
        </Link>
        <div className="relative">
          <button ref={userButtonRef} type="button" aria-label="Tài khoản khách hàng" aria-haspopup="true" aria-expanded={account} aria-controls="we-account-dropdown"
            onClick={() => {setAccount(!account);setMenu(null);setAccess(false);}}
            className={`flex h-11 items-center gap-1 rounded-full border px-2.5 transition-colors hover:bg-[#fff1df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b94f1e] hc-border ${account?"border-[#d97930] bg-[#fff1df]":"border-line bg-white"}`}>
            <UserIcon size={22}/><Chevron/>
          </button>
          {account && <div id="we-account-dropdown" aria-label="Tùy chọn tài khoản" className="we-dropdown absolute right-0 top-full z-50 mt-2 w-[min(300px,calc(100vw-24px))] rounded-[20px] border border-[#ead7c7] bg-white p-2 shadow-[0_14px_45px_rgba(65,33,17,.18)] hc-surface hc-border">
            <div className="mb-1 rounded-xl bg-[#fff3e7] px-3 py-3 text-[#492c1e]">
              <p className="text-sm font-bold">{sessionLoading?"Đang kiểm tra tài khoản…":authenticated?`Tài khoản ${ROLE_LABELS[session.role]||"WayEcho"}`:"Xin chào bạn!"}</p>
              <p className="mt-1 text-xs text-[#70564a]">{authenticated?"Bạn đang đăng nhập vào WayEcho.":"Đăng nhập để quản lý chuyến đi và đặt chỗ của bạn."}</p>
            </div>
            {sessionLoading ? <p role="status" className="px-3 py-3 text-sm">Đang tải thông tin tài khoản…</p> : authenticated ? <>
              <Link href={ROLE_HOME[session.role] || "/profile"} onClick={close} className={menuLink}>{session.role==="traveler"?"Hồ sơ của tôi":"Vào bảng điều khiển"}</Link>
              {session.role==="traveler" && <>
                <Link href="/my-booking" onClick={close} className={menuLink}>Đặt chỗ của tôi</Link>
                <Link href="/my-trip" onClick={close} className={menuLink}>Chuyến đi của tôi</Link>
              </>}
              <div className="my-1 border-t border-[#f0dfd0]"/>
              <button type="button" disabled={logoutBusy} onClick={logoutAccount} className={`${menuLink} w-full text-left text-[#a13d1c] disabled:opacity-60`}>{logoutBusy?"Đang đăng xuất…":"Đăng xuất / Chuyển tài khoản"}</button>
            </> : <>
              <Link href="/login" onClick={close} className={`${menuLink} bg-[#fff0df]`}>Đăng nhập khách hàng</Link>
              <div className="my-1 border-t border-[#f0dfd0]"/>
              <Link href="/profile" onClick={close} className={menuLink}>Hồ sơ tiếp cận trên thiết bị</Link>
              <Link href="/my-booking" onClick={close} className={menuLink}>Đặt chỗ của tôi</Link>
              <Link href="/my-trip" onClick={close} className={menuLink}>Chuyến đi của tôi</Link>
            </>}
            {accountError && <p role="alert" className="m-2 rounded-lg bg-red-50 p-2 text-sm text-red-800">{accountError}</p>}
          </div>}
        </div>
        <button type="button" aria-expanded={mobile} aria-controls="we-mobile-nav" onClick={() => {setMobile(!mobile);setAccount(false);setAccess(false);}}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line xl:hidden" aria-label={mobile?"Đóng menu":"Mở menu"}><MenuIcon size={22}/></button>
      </div>
    </div>
    {mobile && <nav id="we-mobile-nav" className="max-h-[75dvh] overflow-y-auto border-t border-line bg-white px-5 py-3 xl:hidden">{nav}</nav>}
  </header>;
}
