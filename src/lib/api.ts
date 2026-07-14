const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

type LoginRequest = {
  email: string;
  password: string;
  activeTenantId?: string;
};

export type AuthClaims = {
  sub: string;
  globalRole: "SUPERADMIN" | null;
  activeTenantId: string | null;
  effectiveUserId: string;
  actingMode: "NORMAL" | "CONTEXT_SWITCH" | "IMPERSONATION";
  impersonatedBy?: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  claims: AuthClaims;
};

export type RegistrationRecord = {
  id: string;
  registrationNumber: string;
  organizationId: string;
  applicantName: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string;
};

export type OrganizationRecord = {
  id: string;
  name: string;
  code: string;
  type: "POLDA" | "POLRES" | "POLSEK";
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const raw = await response.text();
    try {
      const parsed = JSON.parse(raw) as { message?: string | string[] };
      if (Array.isArray(parsed.message)) {
        throw new Error(parsed.message.join(", "));
      }
      if (typeof parsed.message === "string") {
        throw new Error(parsed.message);
      }
    } catch (error) {
      if (error instanceof Error && error.message !== raw) {
        throw error;
      }
    }
    throw new Error(raw || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// The organization for the caller's active tenant (org admin or context-switched superadmin).
export async function getMyOrganization(token: string): Promise<OrganizationRecord> {
  return request<OrganizationRecord>("/admin/organization", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getAdminRegistrations(
  token: string,
  organizationId?: string,
): Promise<RegistrationRecord[]> {
  const query = organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : "";
  return request<RegistrationRecord[]>(`/admin/registrations${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function listOrganizations(token: string, search?: string): Promise<OrganizationRecord[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return request<OrganizationRecord[]>(`/superadmin/organizations${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createOrganization(
  token: string,
  payload: Omit<OrganizationRecord, "id" | "createdAt" | "updatedAt">,
): Promise<OrganizationRecord> {
  return request<OrganizationRecord>("/superadmin/organizations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export type UpdateOrganizationPayload = {
  name?: string;
  code?: string;
  type?: OrganizationRecord["type"];
  address?: string;
  phone?: string;
};

export async function updateOrganization(
  token: string,
  organizationId: string,
  payload: UpdateOrganizationPayload,
): Promise<OrganizationRecord> {
  return request<OrganizationRecord>(`/superadmin/organizations/${organizationId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateOrganizationStatus(
  token: string,
  organizationId: string,
  isActive: boolean,
): Promise<OrganizationRecord> {
  return request<OrganizationRecord>(`/superadmin/organizations/${organizationId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  });
}

export type DeleteOrganizationResult = {
  ok: boolean;
  hardDeleted: boolean;
  deactivated: boolean;
  message: string;
};

export async function deleteOrganization(
  token: string,
  organizationId: string,
): Promise<DeleteOrganizationResult> {
  return request<DeleteOrganizationResult>(`/superadmin/organizations/${organizationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// --- Org admin (user) management ---

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
};

export type AdminMembership = {
  membership: {
    id: string;
    userId: string;
    organizationId: string;
    role: string;
    status: "ACTIVE" | "INACTIVE" | "INVITED";
    createdAt: string;
    updatedAt: string;
  };
  user: AdminUser | null;
};

export async function listAdmins(
  token: string,
  organizationId: string,
): Promise<AdminMembership[]> {
  return request<AdminMembership[]>(
    `/superadmin/organizations/${organizationId}/memberships`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export type AdminMembershipWithOrg = AdminMembership & {
  organization: { id: string; name: string; code: string };
};

// All org admins across every organization (superadmin user-management view).
export async function listAllAdmins(token: string): Promise<AdminMembershipWithOrg[]> {
  return request<AdminMembershipWithOrg[]>(`/superadmin/admins`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export type CreateAdminPayload = {
  name: string;
  email: string;
  password: string;
};

export type CreateAdminResult = {
  ok: boolean;
  user: AdminUser;
  organizationId: string;
};

export async function createAdmin(
  token: string,
  organizationId: string,
  payload: CreateAdminPayload,
): Promise<CreateAdminResult> {
  return request<CreateAdminResult>(
    `/superadmin/organizations/${organizationId}/admins`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );
}

export async function deactivateAdmin(
  token: string,
  organizationId: string,
  userId: string,
): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(
    `/superadmin/organizations/${organizationId}/memberships/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

// Superadmin enters an organization's admin context (acts as org admin).
export async function switchContext(
  token: string,
  organizationId: string,
): Promise<{ accessToken: string; claims: AuthClaims }> {
  return request<{ accessToken: string; claims: AuthClaims }>("/superadmin/context/switch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ organizationId }),
  });
}

// Superadmin returns to the global (no-tenant) context.
export async function clearContext(
  token: string,
): Promise<{ accessToken: string; claims: AuthClaims }> {
  return request<{ accessToken: string; claims: AuthClaims }>("/superadmin/context/clear", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
