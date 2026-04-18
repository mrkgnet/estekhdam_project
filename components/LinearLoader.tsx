// مسیر فایل: components/LinearLoader.tsx

import React from 'react';

const LinearLoader = () => {
    return (
        <div className="w-full max-w-md mx-auto my-10 p-4">
            {/* استایل انیمیشن اختصاصی برای حرکت نوار */}
            <style>{`
                @keyframes slide-right-to-left {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-loader-line {
                    animation: slide-right-to-left 1.5s infinite linear;
                }
            `}</style>

            {/* متن بالای لودر */}
            <div className="flex items-center justify-center mb-3">
                <span className="text-md text-gray-600 font-medium">
                    در حال بارگذاری اطلاعات...
                </span>
            </div>

            {/* بدنه اصلی لودر */}
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden relative">
                {/* نوار رنگی متحرک */}
                <div className="h-full bg-blue-600 rounded-full w-2/3 absolute animate-loader-line"></div>
            </div>
        </div>
    );
};

export default LinearLoader;
