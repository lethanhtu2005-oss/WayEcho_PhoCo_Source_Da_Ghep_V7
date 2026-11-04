"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import GuideNav from "@/components/GuideNav";
import LogoutButton from "@/components/LogoutButton";
export default function GuideShell({children}) {
 const path=usePathname();
 const [ready,setReady]=useState(false),[error,setError]=useState("");
 useEffect(()=>{
  if(path==="/guide/login"||path==="/guide/register"){setReady(true);return;}
  fetch("/api/auth/session",{cache:"no-store"}).then(async r=>{const d=await r.json();if(!r.ok||d.role!=="guide")throw Error("Bạn cần đăng nhập với vai trò Hướng dẫn viên.");return d;}).then(()=>setReady(true)).catch(e=>setError(e.message));
 },[path]);
 if(path==="/guide/login"||path==="/guide/register")return <div>{children}</div>;
 if(error)return <div className="container-page py-12"><section className="mx-auto max-w-xl rounded-3xl border border-[#ead6bf] bg-white p-7 shadow-xl"><p className="text-sm font-bold uppercase tracking-widest text-[#b96b2d]">WAYECHO · GUIDE</p><h1 className="mt-3 text-3xl font-extrabold text-[#352016]">Đăng nhập Hướng dẫn viên</h1><p className="mt-2 text-sm text-[#665044]">{error}</p><Link href="/partner/login" className="mt-5 inline-flex rounded-xl bg-[#f8ae38] px-5 py-3 font-bold text-[#352016]">Đến Cổng Đối tác</Link></section></div>;
 if(!ready)return <p role="status" className="container-page py-10">Đang kiểm tra quyền Hướng dẫn viên…</p>;
 return <div className="pb-24 md:pb-20"><GuideNav/><p className="container-page pt-4" role="note">DEMO: hồ sơ và lịch minh họa; chưa có phân công hoặc xác minh Guide thực tế.</p><div className="container-page pt-2"><LogoutButton/></div>{children}</div>;
}
