import * as Tabs from '@radix-ui/react-tabs';

const TabsDemo = () => {
  return (
    <div className="flex justify-center p-10 bg-gray-50 min-h-screen font-sans">
      <Tabs.Root 
        className="flex flex-col w-[400px] bg-white shadow-md rounded-lg overflow-hidden" 
        defaultValue="tab1" 
        dir="rtl" // برای راست‌چین بودن تب‌ها
      >
        {/* لیست تب‌ها */}
        <Tabs.List className="flex border-b border-gray-200 bg-gray-100/50">
          <Tabs.Trigger
            className="flex-1 px-5 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-white transition-all outline-none"
            value="tab1"
          >
            حساب کاربری
          </Tabs.Trigger>
          <Tabs.Trigger
            className="flex-1 px-5 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-white transition-all outline-none"
            value="tab2"
          >
            تغییر رمز عبور
          </Tabs.Trigger>
        </Tabs.List>

        {/* محتوای تب اول */}
        <Tabs.Content className="p-5 outline-none" value="tab1">
          <h2 className="text-lg font-semibold mb-2">تنظیمات حساب</h2>
          <p className="text-gray-500 text-sm">
            در این بخش می‌توانید اطلاعات پروفایل خود را به‌روزرسانی کنید.
          </p>
        </Tabs.Content>

        {/* محتوای تب دوم */}
        <Tabs.Content className="p-5 outline-none" value="tab2">
          <h2 className="text-lg font-semibold mb-2">امنیت</h2>
          <p className="text-gray-500 text-sm">
            رمز عبور فعلی خود را وارد کنید تا بتوانید آن را تغییر دهید.
          </p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default TabsDemo;
