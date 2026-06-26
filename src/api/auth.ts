import { apiRequest } from "./client";

export type AuthMembership = {
  companyId: string;
  companyDisplayName: string;
  role: string;
  status: string;
};

export type AuthSession = {
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    isSuperAdmin: boolean;
  };
  memberships: AuthMembership[];
  needsCompanyOnboarding: boolean;
};

type ApiDataResponse<TData> = {
  data: TData;
};

export function loginWithGoogle(idToken: string) {
  return apiRequest<ApiDataResponse<AuthSession>>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export function getCurrentSession() {
  return apiRequest<ApiDataResponse<AuthSession>>("/auth/me");
}

export function logout() {
  return apiRequest<void>("/auth/logout", {
    method: "POST",
  });
}
