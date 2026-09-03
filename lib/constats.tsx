import React from "react";
import {
  Users,
  Newspaper,
  Package,
  ShoppingCart,
  Menu,
  Sliders,
  FolderTree,
  MessageSquare,
  LifeBuoy,
  PhoneCall,
  Bell,
  AlertCircle,
  Image,
  CreditCard,
  Briefcase,
  Home,
} from "lucide-react";

export const tabsDataAdminPanel = [
  {
    id: "1",
    title: "مدیریت کاربران",
    icon: Users,
    url: "/",
    subItems: [
      {
        id: 21,
        title: "مشاهده اطلاعات کاربران",
        url: "/adminp/users",
      },
    ],
  },
  {
    id: "2",
    title: "مدیریت اخبار",
    icon: Newspaper,
    url: "/adminp/jobnews",
    subItems: [
      {
        id: 21,
        title: "افزودن خبر دستگاه های دولتی",
        url: "/adminp/jobnews/government/add-news",
      },
      {
        id: 22,
        title: "ویرایش خبر دستگاه های دولتی",
        url: "/adminp/jobnews/government/edit-news",
      },
    ],
  },
  {
    id: "3",
    title: "مدیریت محصولات",
    icon: Package,
    url: "/adminp/products",
    subItems: [
      {
        id: 31,
        title: "افزودن محصول جدید",
        url: "/adminp/products/government/addproduct",
      },
      {
        id: 32,
        title: "ویرایش محصول",
        url: "/adminp/products/government/editproduct",
      },
    ],
  },
  {
    id: "4",
    title: "مدیریت سفارشات",
    icon: ShoppingCart,
    url: "/",
    subItems: [
      {
        id: 41,
        title: "سفارشات کاربران",
        url: "/adminp/order",
      },
    ],
  },
  {
    id: "11",
    title: "مدیریت منوها",
    icon: Menu,
    url: "/",
    subItems: [
      {
        id: 111,
        title: "منوهای کاربران",
        url: "/adminp/manage-menu",
      },
    ],
  },
  {
    id: "5",
    title: "مدیریت اسلایدر",
    icon: Sliders,
    url: "/adminp/mainslider",
    subItems: [
      {
        id: 51,
        title: "مدیریت اسلایدر اصلی",
        url: "/adminp/mainslider",
      },
    ],
  },
  {
    id: "6",
    title: "مدیریت دسته‌ها",
    icon: FolderTree,
    url: "/adminp/categories",
    subItems: [
      {
        id: 61,
        title: "مدیریت دسته ها کاربران",
        url: "/adminp/categories",
      },
      {
        id: 62,
        title: "مدیریت دسته فصل ها",
        url: "/adminp/category_chapter",
      },
      {
        id: 63,
        title: "مدیریت دسته منابع رایگان",
        url: "/adminp/categories/free-resources-categories",
      },
    ],
  },
  {
    id: "7",
    title: "مدیریت کامنت‌ها",
    icon: MessageSquare,
    url: "/adminp/comments",
    subItems: [
      {
        id: 71,
        title: "کامنت های کاربران",
        url: "/adminp/comments",
      },
    ],
  },
  {
    id: "8",
    title: "مدیریت تیکت‌ها",
    icon: LifeBuoy,
    url: "/adminp/support/tickets",
    subItems: [
      {
        id: 81,
        title: "تیکت های کاربران",
        url: "/adminp/support/tickets",
      },
    ],
  },
  {
    id: "9",
    title: "فرم تماس با ما",
    icon: PhoneCall,
    url: "/adminp/contact",
    subItems: [
      {
        id: 91,
        title: "مدیریت فرم تماس با ما",
        url: "/adminp/contact",
      },
    ],
  },
  {
    id: "10",
    title: "مدیریت پیغام‌ها",
    icon: Bell,
    url: "/adminp/notifications",
    subItems: [
      {
        id: 101,
        title: "مدیریت پیغام ها",
        url: "/adminp/notifications",
      },
      {
        id: 102,
        title: "مدیریت پیغام های کاربر",
        url: "/adminp/notifications/global-notification",
      },
    ],
  },
  {
    id: "12",
    title: "اشکالات سوال ها",
    icon: AlertCircle,
    url: "/adminp/question-issu",
    subItems: [
      {
        id: 121,
        title: "مدیریت اشکالات سوال ها",
        url: "/adminp/question-issu",
      },
    ],
  },
  {
    id: "13",
    title: "بنر بالای صفحه",
    icon: Image,
    url: "/adminp/top-banner",
    subItems: [
      {
        id: 121,
        title: "مدیریت بنر بالای صفحه",
        url: "/adminp/top-banner",
      },
    ],
  },
  {
    id: "14",
    title: "مدیریت پلن ها",
    icon: CreditCard,
    url: "/adminp/planss",
    subItems: [
      {
        id: 121,
        title: "پلن‌های کاربران",
        url: "/adminp/plans",
      },
    ],
  },
  {
    id: "15",
    title: "مدیریت برندها",
    icon: CreditCard,
    url: "/adminp/brands",
    subItems: [
      {
        id: 151,
        title: "مدیریت برندهای استخدامی",
        url: "/adminp/brands",
      },
    ],
  },
];