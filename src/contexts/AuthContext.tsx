import { createContext, useContext, useMemo, useState } from "react";
import {
  login as loginRequest,
  switchContext as switchContextRequest,
  clearContext as clearContextRequest,
  type AuthClaims,
} from "@/lib/api";

const TOKEN_KEY = "polda_access_token";
const CLAIMS_KEY = "polda_auth_claims";

type AuthState = {
  token: string | null;
  claims: AuthClaims | null;
  isAuthenticated: boolean;
  login: (input: {
    email: string;
    password: string;
    activeTenantId?: string;
  }) => Promise<AuthClaims>;
  switchContext: (organizationId: string) => Promise<AuthClaims>;
  clearContext: () => Promise<AuthClaims>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function getInitialToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

function getInitialClaims(): AuthClaims | null {
  const raw = window.localStorage.getItem(CLAIMS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthClaims;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [claims, setClaims] = useState<AuthClaims | null>(getInitialClaims);

  const applySession = (accessToken: string, nextClaims: AuthClaims) => {
    setToken(accessToken);
    setClaims(nextClaims);
    window.localStorage.setItem(TOKEN_KEY, accessToken);
    window.localStorage.setItem(CLAIMS_KEY, JSON.stringify(nextClaims));
  };

  const login: AuthState["login"] = async (input) => {
    const response = await loginRequest(input);
    applySession(response.accessToken, response.claims);
    return response.claims;
  };

  const switchContext: AuthState["switchContext"] = async (organizationId) => {
    if (!token) throw new Error("Tidak ada sesi aktif");
    const response = await switchContextRequest(token, organizationId);
    applySession(response.accessToken, response.claims);
    return response.claims;
  };

  const clearContext: AuthState["clearContext"] = async () => {
    if (!token) throw new Error("Tidak ada sesi aktif");
    const response = await clearContextRequest(token);
    applySession(response.accessToken, response.claims);
    return response.claims;
  };

  const logout = () => {
    setToken(null);
    setClaims(null);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(CLAIMS_KEY);
  };

  const value = useMemo<AuthState>(
    () => ({
      token,
      claims,
      isAuthenticated: Boolean(token && claims),
      login,
      switchContext,
      clearContext,
      logout,
    }),
    [token, claims],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
