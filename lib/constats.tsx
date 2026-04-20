import { Briefcase, CassetteTapeIcon, Home } from "lucide-react";
import React from "react";

// ایمپورت آیکون‌ها از مجموعه Lucide (موجود در react-icons)
import { LuUser, LuShoppingCart, LuRefreshCcw, LuWallet } from "react-icons/lu";


export const tabsDataAdminPanel = [
  {
    id: "1",
    title: "مدیریت کاربران",
    icon: LuUser, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/users",
  },
  {
    id: "2",
    title: " مدیریت اخبار  ",
    icon: LuUser, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/jobnews",
    subItems: [
      {
        id: 21,
        title: 'افزودن خبر دستگاه های دولتی',
        url: '/adminp/jobnews/government/add-news'
      },
      {
        id: 22,
        title: 'ویرایش خبر دستگاه های دولتی',
        url: '/adminp/jobnews/government/edit-news'
      },

    ]
  },
  {
    id: "3",
    title: "مدیریت محصولات",
    icon: LuUser, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/products",
    subItems: [
      { id: 31, title: ' افزودن محصول جدید ', url: '/adminp/products/government/addproduct' },
      { id: 32, title: 'ویرایش محصول', url: '/adminp/products/government/editproduct' },

    ]
  },
  {
    id: "4",
    title: "مدیریت سفارشات ",
    icon: LuUser, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/order",
  },
  {
    id: "11",
    title: "مدیریت منوها ",
    icon: LuUser, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/manage-menu",
    
  },
  {
    id: "5",
    title: "مدیریت اسلایدر اصلی ",
    icon: LuUser, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/mainslider",
  },
  {
    id: "6",
    title: "مدیریت دسته ها ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/categories",
  },

  {
    id: "7",
    title: "مدیریت کامنت ها ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/comments",
  },
  {
    id: "8",
    title: "مدیریت تیکت ها ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/support/tickets",
  },



  {
    id: "9",
    title: "مدیریت فرم تماس با ما ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/contact",
  },
  {
    id: "10",
    title: "مدیریت نوتیفیکشن ها ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/notifications",
  },

    {
    id: "12",
    title: "مدیریت خطاهای سوال ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/question-issu",
  },
];






// src/constants/routes.ts

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  USER: {
    RESOURCES: {
      COURSE: (id: string | number) => `/resources/course/${id}`,
      QUESTIONS: (id: string | number) => `/resources/course/${id}/questions`
    }
  },

  SIDEBAER_USER: {

    RESOURCES: "/resources/",

  },




  ADMIN: {

    DASHBOARD: '/admin',
    GOVERNMENT_PRODUCTS: {

      LIST: '/admin/products/government',
      ADD: '/admin/products/government/addproduct',


      EDIT: (id: string | number) => `/adminp/products/government/editproduct/${id}`,
      ADD_QUESTION: (id: string | number) => `/adminp/questions/${id}`,
    },

  }
};
