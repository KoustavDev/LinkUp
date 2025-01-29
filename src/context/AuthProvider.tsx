"use client";
import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
  useCallback,
} from "react";
import { IUser } from "@/app/types";
import authService from "@/backend/auth";
import { useRouter, useSearchParams } from "next/navigation";

// Initial user state
export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

// Interface for context type
interface AuthContextType {
  user: IUser;
  setUser: Dispatch<SetStateAction<IUser>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isAuth: boolean;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  checkAuth: () => Promise<boolean>;
}

// Initial state for context
const INITIAL_STATE: AuthContextType = {
  user: INITIAL_USER,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  isAuth: false,
  setIsAuth: () => {},
  checkAuth: async () => false,
};

// Create Auth context
export const AuthContext = createContext<AuthContextType>(INITIAL_STATE);

// AuthProvider component
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  // Stable `checkAuth` function using useCallback
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const currentAccount = await authService.getCurrentUser();
      if (currentAccount) {
        setIsAuth(true);
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        return true;
      }
    } catch (error) {
      console.error("AuthProvider :: checkAuth error:", error);
      return false;
    } finally {
      setLoading(false);
    }
    setIsAuth(false);
    return false;
  }, [setLoading, setIsAuth, setUser]);

  // useEffect to handle authentication and routing
  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (!cookieFallback || cookieFallback === "[]") {
      if (!userId && !secret) {
        router.push("/sign-in");
      }
    }

    checkAuth();
  }, [router, checkAuth, userId, secret]); // Include router and checkAuth as dependencies

  // Context value
  const value = {
    user,
    setUser,
    loading,
    setLoading,
    isAuth,
    setIsAuth,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;

// Hook to use Auth context
export const useAuthProvider = () => useContext(AuthContext);
