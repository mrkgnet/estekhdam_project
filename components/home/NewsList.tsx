import Image from "next/image";
import Link from "next/link";

type NewsItem = {
  id: string;
  title: string;
  timeAgo: string;
  image: string;
  href: string;
};

const items: NewsItem[] = [
  {
    id: "1",
    title: "حسین‌زاده بدون اسکوچیچ هم بهترین شد؛ گل سیزدهم در شب ترسناک",
    timeAgo: "۱۰ ساعت پیش",
    image: "/images/photo_400x225.jpg",
    href: "/news/1",
  },
  {
    id: "2",
    title: "اسپالتی: ۳ گام رو به عقب برداشتیم؛ با مسئولیت‌پذیری برای صعود تلاش می‌کنیم",
    timeAgo: "۱۱ ساعت پیش",
    image: "/images/photo_400x225.jpg",
    href: "/news/2",
  },
  {
    id: "3",
    title: "آریلا: اگر وینیسیوس می‌خواست، به بازی ادامه نمی‌دادیم؛ شایسته گل‌های بیشتر بودیم",
    timeAgo: "۱۱ ساعت پیش",
    image: "/images/photo_400x225.jpg",
    href: "/news/3",
  },
  {
    id: "4",
    title: "افکار ریکاردو علیه خودش و استقلال؛ سا پینتو سمپاره روی لبه تیغ!",
    timeAgo: "۱۱ ساعت پیش",
    image: "/images/photo_400x225.jpg",
    href: "/news/4",
  },
  {
    id: "5",
    title: "مورینیو: نمی‌خواهم طرف کسی را بگیرم؛ روی برگه داور نوشتند شوامنی نباید کارت بگیرد!",
    timeAgo: "۱۱ ساعت پیش",
    image: "/images/photo_400x225.jpg",
    href: "/news/5",
  },
];

export default function NewsList() {
  return (
    <div className="space-y-6">
      {items.map((it) => (
        <Link
          key={it.id}
          href={it.href}
          className="flex gap-4 items-start group"
        >
          {/* Thumbnail */}
          <div className="relative w-[140px] h-[78px] rounded-xl overflow-hidden shrink-0 bg-slate-100">
            <Image
              src={it.image}
              alt={it.title}
              fill
              className="object-cover"
              sizes="140px"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] leading-8  text-sky-800 group-hover:text-sky-900 transition line-clamp-2">
              {it.title}
            </h3>

            <div className="mt-2 text-sm text-slate-500">{it.timeAgo}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
