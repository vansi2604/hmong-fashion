"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-xs text-stone-500">
      Đang chuyển hướng đến hồ sơ cá nhân...
    </div>
  );
}
