"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
export default function VolunteerShell({children}){
 const [ready,setReady]=useState(false),[error,setError]=useState("");
 useEffect(()=>{fetch("/api/auth/session",{cache:"no-store"}).then(async r=>{const d=await r.json();if(!r.ok||d.role!=="volunteer")throw Error("Bạn cần đăng nhập với vai trò Tình nguyện viên.");return d;}).then(()=>setReady(true)).catch(e=>setError(e.message));},[]);
 if(error)return <div className="container-page py-12"><section className="mx-auto max-w-xl rounded-3xl border border-[#ead6bf] bg-white p-7 shadow-xl"><p className="text-sm font-bold uppercase tracking-widest text-[#b96b2d]">WAYECHO · VOLUNTEER</p><h1 className="mt-3 text-3xl font-extrabold text-[#352016]">Đăng nhập Tình nguyện viên</h1><p className="mt-2 text-sm text-[#665044]">{error}</p><Link href="/partner/login" className="mt-5 inline-flex rounded-xl bg-[#f8ae38] px-5 py-3 font-bold text-[#352016]">Đến Cổng Đối tác</Link></section></div>;
 if(!ready)return <p role="status" className="container-page py-10">Đang kiểm tra quyền Tình nguyện viên…</p>;
 return <><div className="container-page pt-3"><LogoutButton/></div>{children}</>;
}
