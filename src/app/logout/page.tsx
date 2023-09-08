"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signout } from "../../lib/utils/auth";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const signOutAndRedirect = async () => {
      await signout();
      router.push("/");
    };

    signOutAndRedirect();
  }, [router]);

  return null;
};

export default Logout;
