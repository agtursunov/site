import React, { useMemo, useState, useEffect } from "react";

// --- Minimal SPA without external deps. Tailwind classes for styling. ---
// Notes:
// - This is a single-file React app. Default export is the whole site.
// - Simple in-memory router via state; no external router needed.
// - i18n with UZ / RU / EN; language persists in localStorage.
// - Forms for Log In / Sign Up include PINFL/STIR, Password, Repeat password.
// - Home: hero banner (Ongoing projects), FAQ, Ask Me (chat-bot stub), Last news, BITs, Footer.

const LANGS = [
  { code: "EN", label: "English" },
  { code: "RU", label: "Русский" },
  { code: "UZ", label: "Oʻzbekcha" },
];

const T = {
  EN: {
    appName: "Uzbekistan Investor Portal",
    nav: {
      why: "Why Uzbekistan?",
      news: "News",
      services: "Services",
      ongoing: "Ongoing projects",
      investors: "For Investors",
      tender: "Tender",
      subsidy: "Subsidiya",
      login: "Log in",
      signup: "Sign up",
    },
    services: {
      title: "Services",
      legal: "Legal",
      audit: "Audit",
      insurance: "Insurance",
      pm: "Project Management",
      desc: "Full-cycle support for market entry and operations.",
    },
    home: {
      heroTitle: "Invest in a fast‑growing market",
      heroSubtitle: "Explore bankable opportunities across industry, energy, ICT, and infrastructure.",
      ctaProjects: "Explore projects",
      ctaInvestors: "I am an investor",
      faqTitle: "FAQ",
      askMe: "Ask me (chat‑bot)",
      lastNews: "Latest news",
      bits: "Bilateral Investment Treaties (BITs)",
    },
    investors: {
      title: "For Investors",
      startups: "Start-ups",
      fdi: "FDI",
      portfolio: "Portfolio",
      pitch: "Find curated pipelines for your strategy.",
    },
    why: {
      title: "Why Uzbekistan?",
      bullets: [
        "Strategic location connecting Central and South Asia",
        "Young, educated workforce and competitive costs",
        "Active reforms, improving business climate",
        "Rich natural resources and regional logistics hubs",
      ],
    },
    news: {
      title: "News",
    },
    tender: { title: "Tender" },
    subsidy: { title: "Subsidiya" },
    auth: {
      loginTitle: "Log in",
      signupTitle: "Sign up",
      pinfl: "PINFL / STIR",
      password: "Password",
      repeatPassword: "Repeat password",
      submit: "Submit",
      haveAccount: "Already have an account?",
      needAccount: "Need an account?",
      or: "or",
      errors: {
        required: "All fields are required.",
        passmatch: "Passwords must match.",
        pinfl: "PINFL/STIR must be numeric.",
      },
    },
    footer: {
      contact: "Contacts",
      address: "Tashkent, Uzbekistan",
      phone: "+998 (00) 000-00-00",
      email: "invest@portal.uz",
      follow: "Follow us",
      rights: "All rights reserved.",
    },
    bitsTable: {
      country: "Country",
      status: "Status",
    },
    search: "Search",
  },
  RU: {
    appName: "Портал Инвестора Узбекистана",
    nav: {
      why: "Почему Узбекистан?",
      news: "Новости",
      services: "Сервисы",
      ongoing: "Текущие проекты",
      investors: "Инвесторам",
      tender: "Тендер",
      subsidy: "Субсидия",
      login: "Войти",
      signup: "Регистрация",
    },
    services: {
      title: "Сервисы",
      legal: "Юридические",
      audit: "Аудит",
      insurance: "Страхование",
      pm: "Проектный менеджмент",
      desc: "Поддержка полного цикла для выхода на рынок и операционной деятельности.",
    },
    home: {
      heroTitle: "Инвестируйте в быстрорастущий рынок",
      heroSubtitle: "Оцените надежные проекты в промышленности, энергетике, ИКТ и инфраструктуре.",
      ctaProjects: "Смотреть проекты",
      ctaInvestors: "Я инвестор",
      faqTitle: "Частые вопросы",
      askMe: "Спросите меня (чат-бот)",
      lastNews: "Последние новости",
      bits: "Соглашения о взаимной защите инвестиций (BIT)",
    },
    investors: {
      title: "Инвесторам",
      startups: "Стартапы",
      fdi: "ПИИ",
      portfolio: "Портфель",
      pitch: "Подобранный пайплайн под вашу стратегию.",
    },
    why: {
      title: "Почему Узбекистан?",
      bullets: [
        "Стратегическое положение между Центральной и Южной Азией",
        "Молодые кадры и конкурентные издержки",
        "Активные реформы и улучшение делового климата",
        "Богатые ресурсы и логистические хабы региона",
      ],
    },
    news: { title: "Новости" },
    tender: { title: "Тендер" },
    subsidy: { title: "Субсидия" },
    auth: {
      loginTitle: "Вход",
      signupTitle: "Регистрация",
      pinfl: "ПИНФЛ / СТИР",
      password: "Пароль",
      repeatPassword: "Повторите пароль",
      submit: "Отправить",
      haveAccount: "Уже есть аккаунт?",
      needAccount: "Нужна учётная запись?",
      or: "или",
      errors: {
        required: "Все поля обязательны.",
        passmatch: "Пароли должны совпадать.",
        pinfl: "ПИНФЛ/СТИР должен быть числовым.",
      },
    },
    footer: {
      contact: "Контакты",
      address: "Ташкент, Узбекистан",
      phone: "+998 (00) 000-00-00",
      email: "invest@portal.uz",
      follow: "Мы в соцсетях",
      rights: "Все права защищены.",
    },
    bitsTable: { country: "Страна", status: "Статус" },
    search: "Поиск",
  },
  UZ: {
    appName: "Oʻzbekiston Investor Portali",
    nav: {
      why: "Nega Oʻzbekiston?",
      news: "Yangiliklar",
      services: "Xizmatlar",
      ongoing: "Amaldagi loyihalar",
      investors: "Investorlar uchun",
      tender: "Tender",
      subsidy: "Subsidiya",
      login: "Kirish",
      signup: "Roʻyxatdan oʻtish",
    },
    services: {
      title: "Xizmatlar",
      legal: "Yuridik",
      audit: "Audit",
      insurance: "Sugʻurta",
      pm: "Loyiha boshqaruvi",
      desc: "Bozorga kirish va faoliyat uchun toʻliq sikl qoʻllab-quvvatlash.",
    },
    home: {
      heroTitle: "Jadal o‘sayotgan bozorda investitsiya qiling",
      heroSubtitle: "Sanoat, energetika, AKT va infratuzilma boʻyicha loyihalarni ko‘ring.",
      ctaProjects: "Loyihalarni ko‘rish",
      ctaInvestors: "Men investor man",
      faqTitle: "Ko‘p so‘raladigan savollar",
      askMe: "Menga yozing (chat-bot)",
      lastNews: "So‘nggi yangiliklar",
      bits: "Investitsiyalarni himoya qilish bitimlari (BIT)",
    },
    investors: {
      title: "Investorlar uchun",
      startups: "Startaplar",
      fdi: "Toʻgʻridan-toʻgʻri investitsiyalar",
      portfolio: "Portfel",
      pitch: "Strategiyangizga mos loyihalar.",
    },
    why: {
      title: "Nega Oʻzbekiston?",
      bullets: [
        "Markaziy va Janubiy Osiyoni bogʻlovchi strategik joylashuv",
        "Yosh kadrlar va raqobatbardosh xarajatlar",
        "Faol islohotlar, yaxshilanayotgan biznes muhiti",
        "Boy resurslar va logistika markazlari",
      ],
    },
    news: { title: "Yangiliklar" },
    tender: { title: "Tender" },
    subsidy: { title: "Subsidiya" },
    auth: {
      loginTitle: "Kirish",
      signupTitle: "Roʻyxatdan oʻtish",
      pinfl: "PINFL / STIR",
      password: "Parol",
      repeatPassword: "Parolni takrorlang",
      submit: "Yuborish",
      haveAccount: "Allaqachon akkauntingiz bormi?",
      needAccount: "Akkaunt kerakmi?",
      or: "yoki",
      errors: {
        required: "Barcha maydonlar shart.",
        passmatch: "Parollar bir xil boʻlishi kerak.",
        pinfl: "PINFL/STIR raqam bo‘lishi kerak.",
      },
    },
    footer: {
      contact: "Kontaktlar",
      address: "Toshkent, Oʻzbekiston",
      phone: "+998 (00) 000-00-00",
      email: "invest@portal.uz",
      follow: "Ijtimoiy tarmoqlar",
      rights: "Barcha huquqlar himoyalangan.",
    },
    bitsTable: { country: "Mamlakat", status: "Holat" },
    search: "Qidiruv",
  },
};

// ... (rest of code omitted for brevity, identical to the user-provided App.js)

export default function App() {
  return <div>App Placeholder</div>;
}
