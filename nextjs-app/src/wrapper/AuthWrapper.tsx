"use client";

import { axiosInstance } from "@/config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode
}

export const AuthWrapper: React.FC<Props> = ({ children }: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (pathName !== "/register") {
      renderLoggedInUserInfo();
    }
  }, [pathName]);

  const renderLoggedInUserInfo = async () => {
    try {
      await axiosInstance.get("/auth");
    }
    catch (error: any) {
      // Unauthorize
      router.push("/login");
    }
  }

  return <>{children}</>;
};
