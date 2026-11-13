/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { API_URL } from "@/config/variable";
import type { InfoCompany, InfoUser } from "@/types/api";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [infoUser, setInfoUser] = useState<InfoUser | null>(null);
  const [infoCompany, setInfoCompany] = useState<InfoCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const refresh = useCallback(() => {
    setLoading(true);
    fetch(`${API_URL}/auth/check`, { credentials: "include" })
      .then((res) => res.json())
      .then((data: any) => {
        if (data?.code === "success") {
          setIsLogin(true);
          setInfoUser(data.infoUser ?? null);
          setInfoCompany(data.infoCompany ?? null);
        } else {
          setIsLogin(false);
          setInfoUser(null);
          setInfoCompany(null);
        }
      })
      .catch(() => {
        setIsLogin(false);
        setInfoUser(null);
        setInfoCompany(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [pathname, refresh]);

  return { isLogin, infoUser, infoCompany, loading, refresh };
};
