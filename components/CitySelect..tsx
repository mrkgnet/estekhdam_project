"use client";

import { useState } from "react";




 const provinceCenters = [
  "کل کشور",
  "تهران",
  "اراک",
  "اردبیل",
  "ارومیه",
  "اصفهان",
  "اهواز",
  "ایلام",
  "بجنورد",
  "بندرعباس",
  "بوشهر",
  "بیرجند",
  "تبریز",
  "خرم‌آباد",
  "رشت",
  "زاهدان",
  "زنجان",
  "ساری",
  "سمنان",
  "سنندج",
  "شهرکرد",
  "شیراز",
  "قزوین",
  "قم",
  "کرج",
  "کرمان",
  "کرمانشاه",
  "گرگان",
  "مشهد",
  "همدان",
  "یاسوج",
  "یزد"
];



type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export default function CitySelector({ value, onChange }: Props) {

  const [search, setSearch] = useState("");

  const filtered = provinceCenters.filter((city) =>
    city.includes(search)
  );

  return (
    <div className="space-y-2">

      <input
        type="text"
        placeholder="جستجوی شهر..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg p-3"
      >
        <option value="">انتخاب شهر</option>

        {filtered.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}

      </select>

    </div>
  );
}
