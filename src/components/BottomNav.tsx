"use client";

import { Home, Map as MapIcon, Navigation2, User } from "lucide-react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface BottomNavProps {
  lang?: string;
  dictionary?: {
    home: string;
    course: string;
    search: string;
    my: string;
  };
}

export default function BottomNav({ lang: langProp, dictionary }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const lang = (params.lang as string) || langProp || "ko";
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    setIsLogged(localStorage.getItem("isLoggedIn") === "true");
  }, [pathname]);

  const handleNav = (path: string, requireAuth: boolean = false) => {
    const fullPath = `/${lang}${path === "/" ? "" : path}`;
    if (requireAuth && !isLogged) {
      router.push(`/${lang}/login`);
    } else {
      router.push(fullPath);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === `/${lang}` || pathname === `/${lang}/`;
    }
    return pathname.startsWith(`/${lang}${path}`);
  };

  const defaultLabels: Record<string, { home: string; course: string; search: string; my: string }> = {
    ko: { home: "홈", course: "코스", search: "탐방", my: "마이" },
    en: { home: "Home", course: "Course", search: "Explore", my: "My" },
  };

  const navLabels = dictionary || defaultLabels[lang] || defaultLabels.ko;

  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${isActive("/") ? "active" : ""}`}
        onClick={() => handleNav("/")}
      >
        <Home size={24} />
        <span>{navLabels.home}</span>
      </button>
      <button 
        className={`nav-item ${isActive("/course") ? "active" : ""}`}
        onClick={() => handleNav("/course", true)}
      >
        <MapIcon size={24} />
        <span>{navLabels.course}</span>
      </button>
      <button 
        className={`nav-item ${isActive("/navigation") || isActive("/arrival") ? "active" : ""}`}
        onClick={() => handleNav("/navigation", true)}
      >
        <Navigation2 size={24} />
        <span>{navLabels.search}</span>
      </button>
      <button 
        className={`nav-item ${isActive("/my") ? "active" : ""}`}
        onClick={() => handleNav("/my", true)}
      >
        <User size={24} />
        <span>{navLabels.my}</span>
      </button>
    </nav>
  );
}
