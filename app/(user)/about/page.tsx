import React from 'react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* هدر و معرفی اولیه */}
        <header className="text-center space-y-6">
          <h1 className="font-bold text-gray-900">
            درباره <span className="text-blue-600">سایت ما</span>
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            مرجع تخصصی و جامع منابع آزمون‌های استخدامی. ما اینجا هستیم تا مسیر موفقیت در آزمون‌های استخدامی را با ارائه بهترین منابع مطالعاتی برای شما هموارتر کنیم.
          </p>
        </header>

        {/* بخش ماموریت ما */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">ماموریت ما</h2>
          <p className="text-gray-600 leading-relaxed">
            ماموریت ما، برقراری عدالت آموزشی و دسترسی آسان و سریع همه کارجویان سراسر کشور به بهترین منابع مطالعاتی است. ما بر این باوریم که با تلاش مستمر و در اختیار داشتن منابع استاندارد، موفقیت در هر آزمونی دست‌یافتنی است. هدف ما بی‌نیاز کردن شما از سردرگمی میان ده‌ها منبع مختلف است.
          </p>
        </section>

        {/* بخش ویژگی‌ها و خدمات (گرید) */}
        <section className="space-y-8">
          <h2 className="font-semibold text-gray-900 text-center">خدمات و ویژگی‌های ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* کارت 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">بانک جامع نمونه سوالات</h3>
              <p className="text-gray-600 leading-relaxed">
                گردآوری و طبقه‌بندی دقیق نمونه سوالات عمومی و تخصصی سال‌های گذشته به همراه پاسخنامه‌های کاملاً تشریحی.
              </p>
            </div>

            {/* کارت 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">جزوات هدفمند</h3>
              <p className="text-gray-600 leading-relaxed">
                ارائه خلاصه‌دروس و جزواتی که دقیقاً منطبق بر سرفصل‌های اعلام‌شده آزمون‌های استخدامی ارگان‌ها تهیه شده‌اند.
              </p>
            </div>

            {/* کارت 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">اخبار و اطلاعیه‌ها</h3>
              <p className="text-gray-600 leading-relaxed">
                پوشش لحظه‌ای و دقیق اخبار ثبت‌نام، دریافت کارت، برگزاری آزمون و اعلام نتایج برای اینکه هیچ فرصتی را از دست ندهید.
              </p>
            </div>

            {/* کارت 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">صرفه‌جویی در زمان</h3>
              <p className="text-gray-600 leading-relaxed">
                ارائه پکیج‌های کامل و جامع که داوطلب را از سردرگمی میان ده‌ها منبع مختلف بی‌نیاز می‌کند و زمان مطالعه را بهینه می‌سازد.
              </p>
            </div>

          </div>
        </section>

        {/* بخش تماس با ما (CTA) */}
        <section className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-lg">
          <h2 className="font-bold mb-4">همراه شما تا روز آزمون</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            ما تنها یک وب‌سایت فروش منابع نیستیم؛ بلکه پشتیبان شما از لحظه تصمیم‌گیری تا روز آزمون هستیم. برای راهنمایی بیشتر با ما در ارتباط باشید.
          </p>
          <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-sm">
            تماس با پشتیبانی
          </button>
        </section>

      </div>
    </div>
  );
}