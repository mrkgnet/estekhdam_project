import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";

interface Category {
    id: string | number;
    name?: string;
    catName?: string;
    slug?: string;
    catSlug?: string;
    imageUrl?: string | null;
}

export default function FreeResourceComponent({
    categories = [],
}: {
    categories?: Category[];
}) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="w-full " dir="rtl">



            <div className="relative overflow-visible rounded-2xl ">


                {/* Header */}
                <div className=" bg-gradient-to-l from-[#3b5998] to-[#5577ba] flex flex-col rounded-t-lg shadow-lg">
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <h2 className="text-13 sm:text-16 font-bold text-white whitespace-nowrap">
                            منابع رایگان
                        </h2>

                        <div className="h-1.5 flex-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                        <Link
                            href="/resources/free-resources"
                            className="text-14  text-white hover:text-white transition-colors whitespace-nowrap border border-white/20 hover:border-white/50 rounded-full px-2.5 py-0.5"
                        >
                            مشاهده همه
                        </Link>
                    </div>

                    <div className="h-[80px]">

                    </div>

                </div>

                {/* Cards */}
                <div className="relative z-10  bottom-28 mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 translate-y-8">
                    {categories.map((cat) => {
                        const categoryName = cat.catName || cat.name || "دسته‌بندی";
                        const categorySlug = cat.catSlug || cat.slug || "";

                        return (
                            <Link
                                key={cat.id}
                                href={`/resources/free-resources?category=${categorySlug}`}
                                className="
                  group
                  min-h-[118px]
                  rounded-2xl
                  bg-white
                  border border-slate-100
                  shadow-sm
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  p-3
                  flex flex-col items-center justify-center gap-2
                "
                            >
                                <div
                                    className="
                    relative
                    w-14 h-14
                    sm:w-16 sm:h-16
                    rounded-full
                    bg-blue-50
                    border border-blue-100
                    overflow-hidden
                    shadow-inner
                    flex items-center justify-center
                    transition-all duration-300
                    group-hover:scale-105
                    group-hover:border-blue-300
                  "
                                >
                                    {cat.imageUrl ? (
                                        <Image
                                            src={cat.imageUrl}
                                            alt={categoryName}
                                            fill
                                            sizes="64px"
                                            className="object-contain p-2"
                                        />
                                    ) : (
                                        <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                                    )}
                                </div>

                                <h3 className="text-[11px] sm:text-xs font-bold text-slate-700 text-center leading-5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {categoryName}
                                </h3>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Space for overlapped cards */}
            <div className="h-10" />
        </section>
    );
}
