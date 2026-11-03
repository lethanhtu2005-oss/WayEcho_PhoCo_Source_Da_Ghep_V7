import {pageMetadata} from "@/lib/seo";
import Link from "next/link";
import {articles} from "@/data/articles";
import {oldQuarterBlogs} from "@/data/oldQuarterBlogs";
import {newBlogPosts} from "@/data/newBlogPosts";
import {getDestination} from "@/data/destinations";
import VerifiedImage from "@/components/VerifiedImage";
export const metadata=pageMetadata("Blog & Trải nghiệm WayEcho","Những câu chuyện về Phố cổ Hà Nội, du lịch tiếp cận và hành trình WayEcho.","/articles");
export default function Articles(){return <div className="container-page py-12"><div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-widest text-[#bd5e26]">WayEcho Editorial</p><h1 className="mt-3 text-4xl sm:text-5xl">Blog & Trải nghiệm</h1><p className="mt-4 text-lg leading-8 text-ink-soft">Những câu chuyện về di sản, con người và nhịp sống Phố cổ Hà Nội, cùng kiến thức chuẩn bị một hành trình dễ tiếp cận hơn.</p></div>
<h2 className="mt-12 font-serif text-3xl font-bold">Câu chuyện WayEcho & Phố cổ Hà Nội</h2><div className="mt-6 grid gap-6 md:grid-cols-2">{[...newBlogPosts,...oldQuarterBlogs].map(a=><Link href={`/articles/${a.slug}`} key={a.slug} className="group overflow-hidden rounded-3xl border border-line bg-white shadow-card"><VerifiedImage src={a.image} fallback="/assets/images/location-image-unavailable.svg" alt={a.alt} className="h-56 w-full object-cover sm:h-64"/><div className="p-6"><p className="text-xs font-bold text-[#a94c20]">{a.tag}</p><h3 className="mt-2 font-serif text-2xl font-bold group-hover:text-[#bc5324]">{a.title}</h3><p className="mt-3 leading-7 text-ink-soft">{a.intro}</p><p className="mt-4 font-semibold text-[#b65123]">Khám phá câu chuyện →</p></div></Link>)}</div>
<h2 className="mt-14 font-serif text-3xl font-bold">Cẩm nang du lịch tiếp cận</h2><div className="mt-6 grid gap-6 lg:grid-cols-3">{articles.map(a=><article key={a.slug} className="rounded-2xl border border-line bg-white p-6 shadow-card"><p className="text-sm text-[#ac4c22]">{a.category}</p><h3 className="mt-2 text-2xl"><Link href={`/articles/${a.slug}`} className="underline">{a.title}</Link></h3><p className="mt-3 text-ink-soft">{a.summary}</p></article>)}</div></div>}
