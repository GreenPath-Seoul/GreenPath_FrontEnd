"use client";

import { Home, Map as MapIcon, RotateCcw, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    setIsLogged(localStorage.getItem("isLoggedIn") === "true");
  }, [pathname]);

  const handleNav = (path: string, requireAuth: boolean = false) => {
    if (requireAuth && !isLogged) {
      router.push("/login");
    } else {
      router.push(path);
    }
  };

  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${pathname === "/" ? "active" : ""}`}
        onClick={() => handleNav("/")}
      >
        <Home size={24} />
        <span>홈</span>
      </button>
      <button 
        className={`nav-item ${pathname === "/course" || pathname === "/exploration" ? "active" : ""}`}
        onClick={() => handleNav("/course", true)}
      >
        <MapIcon size={24} />
        <span>탐방</span>
      </button>
      <button 
        className={`nav-item ${pathname === "/record" ? "active" : ""}`}
        onClick={() => handleNav("/record", true)}
      >
        <RotateCcw size={24} />
        <span>기록</span>
      </button>
      <button 
        className={`nav-item ${pathname === "/my" ? "active" : ""}`}
        onClick={() => handleNav("/my", true)}
      >
        <User size={24} />
        <span>마이</span>
      </button>
    </nav>
  );
}
