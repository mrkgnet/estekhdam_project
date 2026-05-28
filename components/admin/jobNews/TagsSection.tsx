import { Briefcase, MapPin, Plus, X } from "lucide-react";

interface Props {
    jobs: string[];
    setJobs: (val: string[]) => void;
    jobInput: string;
    setJobInput: (val: string) => void;
    cities: string[];
    setCities: (val: string[]) => void;
    cityInput: string;
    setCityInput: (val: string) => void;
}

export default function TagsSection({ jobs, setJobs, jobInput, setJobInput, cities, setCities, cityInput, setCityInput }: Props) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
        if (e.key === "Enter") {
            e.preventDefault();
            action();
        }
    };

    const addJob = () => {
        const value = jobInput.trim();
        if (!value || jobs.includes(value)) return;
        setJobs([...jobs, value]);
        setJobInput("");
    };

    const addCity = () => {
        const value = cityInput.trim();
        if (!value || cities.includes(value)) return;
        setCities([...cities, value]);
        setCityInput("");
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* شغل ها */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Briefcase className="w-5 h-5" /></div>
                    <h2 className="text-slate-800">شغل‌های مورد نیاز</h2>
                </div>
                <div className="flex gap-2">
                    <input value={jobInput} onChange={(e) => setJobInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, addJob)} placeholder="مثلا: آموزگار ابتدایی (Enter)" className="flex-1 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <button type="button" onClick={addJob} className="bg-indigo-100 text-indigo-700 p-3 rounded-xl hover:bg-indigo-200 shrink-0"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 min-h-[40px] items-start">
                    {jobs.length === 0 && <span className="text-slate-400 py-1">موردی اضافه نشده است</span>}
                    {jobs.map((job, i) => (
                        <span key={i} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 group">
                            {job} <button type="button" onClick={() => setJobs(jobs.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 p-0.5"><X className="w-3 h-3" /></button>
                        </span>
                    ))}
                </div>
            </div>

            {/* شهرها */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><MapPin className="w-5 h-5" /></div>
                    <h2 className="text-slate-800">شهرهای محل خدمت</h2>
                </div>
                <div className="flex gap-2">
                    <input value={cityInput} onChange={(e) => setCityInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, addCity)} placeholder="مثلا: تهران (Enter)" className="flex-1 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none" />
                    <button type="button" onClick={addCity} className="bg-rose-100 text-rose-700 p-3 rounded-xl hover:bg-rose-200 shrink-0"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 min-h-[40px] items-start">
                    {cities.length === 0 && <span className="text-slate-400 py-1">موردی اضافه نشده است</span>}
                    {cities.map((city, i) => (
                        <span key={i} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 group">
                            {city} <button type="button" onClick={() => setCities(cities.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 p-0.5"><X className="w-3 h-3" /></button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
