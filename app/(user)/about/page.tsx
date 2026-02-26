import Link from "next/link";

export default function AboutPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-zinc-900">
      {/* subtle background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 right-[-120px] h-[420px] w-[420px] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-40 left-[-140px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[30%] h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-7">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            درباره «بازارِ هوش»
          </div>

          <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-5xl">
            اینجا{" "}
            <span className="bg-gradient-to-l from-red-500 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
              بازارِ هوش
            </span>{" "}
            است
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-600">
            جایی که ابزارهای هوشمند، فقط یک اشتراک دیجیتال نیستند…
            <br />
            <span className="font-semibold text-zinc-900">
              کلیدهایی‌اند برای باز کردن درهای آینده.
            </span>
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <FeatureCard
              color="red"
              title="روشن و صریح"
              desc="نامی ساده، مدرن و قابل‌فهم."
            />
            <FeatureCard
              color="fuchsia"
              title="اقتصادی و قابل‌اعتماد"
              desc="گزینه‌هایی مناسب برای هر بودجه."
            />
            <FeatureCard
              color="amber"
              title="سریع و بی‌دردسر"
              desc="دسترسی آسان به ابزارهای آینده."
            />
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              مشاهده محصولات
            </Link>
            {/* <a
              href="/contact"
              className="rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
            >
              تماس با ما
            </a> */}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6 text-base leading-8 text-zinc-600">
            <p>
              ما این نام را انتخاب کردیم چون روشن، صریح و مدرن است.
            </p>

            <p>
              «بازارِ هوش» یعنی یک فضای واقعی برای داد و ستد ابزارهایی که زندگی،
              درس و کارتان را متحول می‌کنند؛ یعنی جایی که واقعاً می‌توان هوشمندی
              را خرید، تجربه کرد و وارد زندگی روزمره کرد؛ از درس و پژوهش گرفته تا
              تولید محتوا و کار حرفه‌ای.
            </p>
          </div>

          <div className="space-y-6 text-base leading-8 text-zinc-600">
            <p>
              در «بازارِ هوش»، ما آفرهای اقتصادی و مقرون‌به‌صرفه‌ای ارائه می‌کنیم؛
              گزینه‌هایی که برای هر بودجه و هر نیاز، یک انتخاب مناسب و قابل‌اعتماد
              دارند.
            </p>

            <p>
              اینجا شما می‌توانید با هزینه‌ای منطقی، به ابزارهایی دسترسی پیدا کنید
              که چند قدم شما را از بقیه جلوتر می‌برند.
            </p>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <AudienceCard
            color="red"
            title="برای دانشجوها"
            desc="ابزار درست برای درس و پروژه‌ها."
          />
          <AudienceCard
            color="fuchsia"
            title="برای پژوهشگرها"
            desc="دسترسی سریع به امکانات حرفه‌ای."
          />
          <AudienceCard
            color="amber"
            title="برای تولیدکننده‌ها"
            desc="چند قدم جلوتر از جهان حرکت کن."
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-[28px] border border-zinc-200 bg-gradient-to-l from-red-50 via-fuchsia-50 to-amber-50 p-10 text-center">
          <h2 className="text-2xl font-bold">
            خرید آسانِ تکنولوژی فردا.
          </h2>
          <p className="mt-3 text-zinc-600">
            آماده‌ای چند قدم جلوتر حرکت کنی؟
          </p>

          <a
            href="/products"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-l from-red-500 via-fuchsia-500 to-amber-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            شروع خرید
          </a>
        </div>
      </section>
    </main>
  );
}

/* Components */

function FeatureCard({
  title,
  desc,
  color,
}: {
  title: string;
  desc: string;
  color: "red" | "fuchsia" | "amber";
}) {
  const border =
    color === "red"
      ? "hover:border-red-300"
      : color === "fuchsia"
      ? "hover:border-fuchsia-300"
      : "hover:border-amber-300";

  return (
    <div className={`rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition ${border}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm text-zinc-600 leading-7">{desc}</div>
    </div>
  );
}

function AudienceCard({
  title,
  desc,
  color,
}: {
  title: string;
  desc: string;
  color: "red" | "fuchsia" | "amber";
}) {
  const dot =
    color === "red"
      ? "bg-red-500"
      : color === "fuchsia"
      ? "bg-fuchsia-500"
      : "bg-amber-500";

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className={`mt-2 h-2 w-2 rounded-full ${dot}`} />
        <div>
          <div className="font-semibold">{title}</div>
          <div className="mt-2 text-sm text-zinc-600 leading-7">{desc}</div>
        </div>
      </div>
    </div>
  );
}
