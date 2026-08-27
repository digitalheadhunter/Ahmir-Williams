import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Address, User } from "@/types";

const STORAGE_KEY = "@forkfast/user";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, _password: string) => Promise<void>;
  signup: (name: string, email: string, _password: string) => Promise<void>;
  logout: () => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const defaultAddress: Address = {
  id: "addr-home",
  label: "Home",
  line1: "221B Baker Street",
  line2: "Apt 4",
  city: "London",
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (nextUser: User | null) => {
    setUser(nextUser);
    if (nextUser) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (email: string, _password: string) => {
      await persist({
        id: "u1",
        name: email.split("@")[0] || "Guest",
        email,
        addresses: [defaultAddress],
      });
    },
    [persist]
  );

  const signup = useCallback(
    async (name: string, email: string, _password: string) => {
      await persist({
        id: "u1",
        name,
        email,
        addresses: [defaultAddress],
      });
    },
    [persist]
  );

  const logout = useCallback(async () => {
    await persist(null);
  }, [persist]);

  const addAddress = useCallback((address: Omit<Address, "id">) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        addresses: [...prev.addresses, { ...address, id: `addr-${Date.now()}` }],
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, signup, logout, addAddress }),
    [user, isLoading, login, signup, logout, addAddress]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
