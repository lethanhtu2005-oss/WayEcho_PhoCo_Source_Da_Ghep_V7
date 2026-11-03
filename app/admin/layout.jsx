import AdminNav from "@/components/AdminNav";
export const metadata={robots:{index:false,follow:false},title:{default:"Nội bộ WayEcho",template:"%s · WayEcho Internal"}};
export default function AdminLayout({children}){return <div className="min-h-screen bg-[#fffaf4] lg:grid lg:grid-cols-[255px_minmax(0,1fr)]"><AdminNav/><div className="min-w-0 pb-24 md:pb-16">{children}</div></div>}
