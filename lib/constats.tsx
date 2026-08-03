import { Briefcase, CassetteTapeIcon, Home } from "lucide-react";
import React from "react";

// ایمپورت آیکون‌ها از مجموعه Lucide (موجود در react-icons)
import { LuUser, LuShoppingCart, LuRefreshCcw, LuWallet } from "react-icons/lu";


export const tabsDataAdminPanel = [
  {
    id: "1",
    title: " کاربران",
    icon: LuUser, // آیکون کاربر برای حساب‌های کاربری
    url: "/",
    subItems: [
      {
        id: 21,
        title: "مشاهده اطلاعات کاربران",
        url: "/adminp/users",
      },
    ]
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
    title: " سفارشات ",
    icon: LuUser, // آیکون کاربر برای حساب‌های کاربری
    url: "/",
    subItems: [
      {
        id: 41,
        title: " سفارشات کاربران",
        url: "/adminp/order",
      },
    ]
  },
  {
    id: "11",
    title: " منوها ",
    icon: LuUser, // آیکون کاربر برای حساب‌های کاربری
    url: "/",
    subItems: [
      {
        id: 111,
        title: " منوهای کاربران",
        url: "/adminp/manage-menu",
      },
    ]

  },
  {
    id: "5",
    title: "مدیریت اسلایدر  ",
    icon: LuUser, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/mainslider",
    subItems: [
      {
        id: 51,
        title: "مدیریت  اسلایدر اصلی",
        url: "/adminp/mainslider",
      },
    ]
  },
  {
    id: "6",
    title: " دسته ها ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/categories",
    subItems: [
      {
        id: 61,
        title: "مدیریت دسته ها کاربران",
        url: "/adminp/categories",
      },
      {
        id: 62,
        title: "مدیریت دسته فصل ها ",
        url: "/adminp/category_chapter",
      },
      {
        id: 63,
        title: "مدیریت دسته منابع رایگان ",
        url: "/adminp/categories/free-resources-categories",
      },
    ]
  },

  {
    id: "7",
    title: " کامنت ها ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/comments",
    subItems: [
      {
        id: 71,
        title: " کامنت های کاربران",
        url: "/adminp/comments",
      },
    ]
  },
  {
    id: "8",
    title: " تیکت ها ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/support/tickets",
    subItems: [
      {
        id:81,
        title: " تیکت های کاربران",
        url: "/adminp/support/tickets",
      },
    ]
  },



  {
    id: "9",
    title: " فرم تماس با ما ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/contact",
    subItems: [
      {
        id: 91,
        title: "مدیریت فرم تماس با ما ",
        url: "/adminp/contact",
      },
    ]
  },
  {
    id: "10",
    title: " پیغام ها ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/notifications",
    subItems: [
      {
        id: 101,
        title: "مدیریت پیغام ها ",
        url: "/adminp/notifications",
      },
       {
        id: 102,
        title: " مدیریت پیغام های کاربر ",
        url: "/adminp/notifications/global-notification",
      },
      
    ]
  },

  {
    id: "12",
    title: "اشکالات سوال ها",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/question-issu",
    subItems: [
      {
        id: 121,
        title: "مدیریت اشکالات سوال ها",
        url: "/adminp/question-issu",
      },
    ]
  },

  {
    id: "13",
    title: "بنر بالای صفحه ",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/top-banner",
    subItems: [
      {
        id: 121,
        title: "مدیریت  بن بالای صفحه ",
        url: "/adminp/top-banner",
      },
    ]
  },
  {
    id: "14",
    title: "مدیریت پلن ها",
    icon: CassetteTapeIcon, // آیکون کاربر برای حساب‌های کاربری
    url: "/adminp/planss",
    subItems: [
      {
        id: 121,
        title: "پلن‌های کاربران ",
        url: "/adminp/plans",
      },
    ]
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
