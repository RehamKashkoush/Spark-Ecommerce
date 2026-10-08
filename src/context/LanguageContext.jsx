import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  en: { home: "Home", shop: "Shop", categories: "Categories", orders: "My Orders", signIn: "Sign in", signOut: "Sign out", language: "Language", english: "English", arabic: "العربية", search: "Search", wishlist: "Wishlist", cart: "Cart", profile: "Profile", notifications: "Notifications", loyalty: "Loyalty & Rewards", referrals: "Refer & Earn", newsletter: "Newsletter", subscribe: "Subscribe", unsubscribe: "Unsubscribe", save: "Save", cancel: "Cancel" },
  ar: { home: "الرئيسية", shop: "المتجر", categories: "التصنيفات", orders: "طلباتي", signIn: "تسجيل الدخول", signOut: "تسجيل الخروج", language: "اللغة", english: "English", arabic: "العربية", search: "بحث", wishlist: "المفضلة", cart: "السلة", profile: "الملف الشخصي", notifications: "الإشعارات", loyalty: "المكافآت والنقاط", referrals: "ادعُ واكسب", newsletter: "النشرة البريدية", subscribe: "اشتراك", unsubscribe: "إلغاء الاشتراك", save: "حفظ", cancel: "إلغاء" },
};

const phrasePairs = {
  "Home": "الرئيسية", "Shop": "المتجر", "Catalog": "الكتالوج", "Collections": "المجموعات", "Categories": "التصنيفات", "My Orders": "طلباتي", "Sign in": "تسجيل الدخول", "Sign out": "تسجيل الخروج", "Profile": "الملف الشخصي", "Wishlist": "المفضلة", "Cart": "السلة", "Search": "بحث", "Notifications": "الإشعارات", "Settings": "الإعدادات", "Dashboard": "لوحة التحكم", "Products": "المنتجات", "Orders": "الطلبات", "Payouts": "المدفوعات", "Users": "المستخدمون", "Sellers": "البائعون", "Coupons": "الكوبونات", "Content": "المحتوى", "Email Marketing": "التسويق بالبريد", "Loyalty & Rewards": "المكافآت والنقاط", "Referrals": "الإحالات", "Admin Control Panel": "لوحة تحكم المسؤول", "Seller Hub": "لوحة البائع", "Vendor Hub": "لوحة البائع", "Executive Terminal": "لوحة الإدارة التنفيذية", "Customer Portal": "بوابة العميل", "Admin Portal": "بوابة المسؤول", "Seller Portal": "بوابة البائع", "Welcome to Spark Commerce": "مرحبًا بك في Spark Commerce", "Password": "كلمة المرور", "Email": "البريد الإلكتروني", "Phone": "الهاتف", "Full name": "الاسم الكامل", "Forgot password?": "هل نسيت كلمة المرور؟", "Create an account": "إنشاء حساب", "Create one": "إنشاء حساب", "Add": "إضافة", "+ Add": "+ إضافة", "Add to Cart": "إضافة إلى السلة", "Shop Now": "تسوق الآن", "Browse Full Catalog": "تصفح الكتالوج بالكامل", "Shop Exclusive Deals": "تسوق العروض الحصرية", "View All Categories": "عرض كل التصنيفات", "Save": "حفظ", "Cancel": "إلغاء", "Subscribe": "اشتراك", "Subscribe Now": "اشترك الآن", "Join": "انضمام", "Loading": "جارٍ التحميل", "Loading products catalog...": "جارٍ تحميل كتالوج المنتجات...", "Something went wrong": "حدث خطأ ما", "Reload Application": "إعادة تحميل التطبيق", "No reviews yet.": "لا توجد مراجعات بعد.", "No orders found.": "لا توجد طلبات.", "Order processing queue": "قائمة معالجة الطلبات", "All": "الكل", "Confirmed": "مؤكد", "Processing": "قيد المعالجة", "Shipped": "تم الشحن", "Delivered": "تم التسليم", "Active": "نشط", "Inactive": "غير نشط", "Out of Stock": "غير متوفر", "In Stock": "متوفر", "Manage products": "إدارة المنتجات", "Add product": "إضافة منتج", "Create Promo": "إنشاء عرض", "Add Category": "إضافة تصنيف", "Moderate Vendors": "مراجعة البائعين", "Export Report": "تصدير التقرير", "Export CSV": "تصدير CSV", "Invite Member": "دعوة عضو", "Change Role": "تغيير الدور", "Suspend": "تعليق", "Approve": "موافقة", "Reject": "رفض", "Delete": "حذف", "Edit": "تعديل", "Update": "تحديث", "Track Order": "تتبع الطلب", "Track Package": "تتبع الشحنة", "Shipping & Returns": "الشحن والاسترجاع", "My Account": "حسابي", "Premium products, simple shopping and a seamless order experience.": "منتجات مميزة وتسوق بسيط وتجربة طلب سلسة.", "Customer": "العميل", "Seller": "البائع", "Admin": "المسؤول", "Light mode": "الوضع الفاتح", "Dark mode": "الوضع الداكن", "Switch to light mode": "التبديل للوضع الفاتح", "Switch to dark mode": "التبديل للوضع الداكن"
};
const reversePairs = Object.fromEntries(Object.entries(phrasePairs).map(([en, ar]) => [ar, en]));
const originalText = new WeakMap();

function translateDocument(language) {
  if (typeof document === "undefined") return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  nodes.forEach((textNode) => {
    const original = originalText.get(textNode) ?? textNode.nodeValue;
    originalText.set(textNode, original);
    const value = original.trim();
    if (!value || value.length > 180) return;
    const translated = language === "ar" ? phrasePairs[value] : original;
    if (translated) textNode.nodeValue = textNode.nodeValue.replace(textNode.nodeValue.trim(), translated);
  });
  document.querySelectorAll("input[placeholder], textarea[placeholder], [title], [aria-label]").forEach((element) => {
    const datasetKeys = { placeholder: "originalPlaceholder", title: "originalTitle", "aria-label": "originalAriaLabel" };
    ["placeholder", "title", "aria-label"].forEach((attribute) => {
      const datasetKey = datasetKeys[attribute];
      const value = element.getAttribute(attribute);
      if (!value) return;
      const original = element.dataset[datasetKey] || value;
      element.dataset[datasetKey] = original;
      element.setAttribute(attribute, language === "ar" ? (phrasePairs[original] || original) : original);
    });
  });
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => { try { return localStorage.getItem("spark-language") || "en"; } catch { return "en"; } });
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("spark-language", language); } catch {}
    const apply = () => translateDocument(language);
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);
  const value = useMemo(() => ({ language, setLanguage, isArabic: language === "ar", t: (key) => (translations[language] || translations.en)[key] || translations.en[key] || key }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) return { language: "en", setLanguage: () => {}, isArabic: false, t: (key) => key };
  return context;
}
