"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import SOSLink from "@/components/SOSLink";
const LINKS=[
 {href:"/admin",label:"Tổng quan",icon:"▦",exact:true},
 {href:"/admin/consultation",label:"Trung tâm tư vấn",icon:"◉"},
 {href:"/admin/businesses",label:"Quản lý đối tác",icon:"▣"},
 {href:"/admin/inquiries",label:"Yêu cầu hợp tác",icon:"✉"},
 {href:"/admin/moderation",label:"Kiểm duyệt thông tin",icon:"✓"},
 {href:"/admin/ride-demo",label:"Theo dõi xe DEMO",icon:"▤"},
];
export default function AdminNav(){
 const pathname=usePathname();const [role,setRole]=useState(null);
 useEffect(()=>{fetch("/api/auth/session",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(u=>setRole(u?.role||null)).catch(()=>setRole(null));},[]);
 const items=LINKS.filter(x=>role==="advisor"?x.href==="/admin/consultation":role==="admin");
 return <aside className="bg-[#392219] text-white lg:min-h-screen" aria-label="Điều hướng nội bộ WayEcho">
  <div className="sticky top-0 p-5 lg:p-6">
   <Link href={role==="advisor"?"/admin/consultation":"/admin"} className="inline-flex items-center gap-3 text-2xl font-black text-[#ffa64a]"><span aria-hidden="true">◈</span> WayEcho</Link>
   <p className="mt-1 text-xs uppercase tracking-widest text-[#e9cbb2]">Internal Portal · DEMO</p>
   <div className="mt-7 rounded-2xl border border-[#785244] bg-[#523528] p-4"><p className="text-sm font-bold">{role==="advisor"?"Tư vấn viên":"Quản trị và vận hành"}</p><p className="mt-1 text-xs text-[#e5c8b7]">Quyền được kiểm tra từ server</p></div>
   <nav className="mt-5 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Chức năng nội bộ">
    {items.map(x=>{const active=x.exact?pathname===x.href:pathname.startsWith(x.href);return <Link key={x.href} href={x.href} aria-current={active?"page":undefined} className={`inline-flex min-h-12 shrink-0 items-center gap-3 rounded-xl px-4 text-sm font-bold ${active?"bg-[#f08321] text-white":"text-[#f8e7d7] hover:bg-[#633e31]"}`}><span className="text-lg" aria-hidden="true">{x.icon}</span>{x.label}</Link>})}
   </nav>
   <div className="mt-8 space-y-3 border-t border-[#795547] pt-5"><SOSLink/><Link href="/internal/login" className="block text-sm font-semibold text-[#f5d6bc] underline">Chuyển tài khoản nhân viên</Link><Link href="/partner" className="block text-sm text-[#f5d6bc] underline">Cổng đối tác</Link><LogoutButton/></div>
 </div>
 </aside>;
}
