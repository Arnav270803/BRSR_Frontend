const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

async function parseApiError(response: Response): Promise<ApiError> {
  let errorBody: ApiErrorResponse | null = null;

  try {
    errorBody = (await response.json()) as ApiErrorResponse;
  } catch {
    errorBody = null;
  }

  return new ApiError(
    errorBody?.error?.message ?? "Request failed",
    response.status,
    errorBody?.error?.code,
  );
}

function canRefreshAuth(path: string): boolean {
  return !["/auth/google", "/auth/refresh", "/auth/logout"].includes(path);
}

async function refreshSession(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.ok;
}

export async function apiRequest<TData>(
  path: string,
  options: RequestInit = {},
): Promise<TData> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await parseApiError(response);

    if (response.status === 401 && canRefreshAuth(path) && (await refreshSession())) {
      const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (retryResponse.ok) {
        if (retryResponse.status === 204) {
          return undefined as TData;
        }

        return retryResponse.json() as Promise<TData>;
      }

      throw await parseApiError(retryResponse);
    }

    throw error;
  }

  if (response.status === 204) {
    return undefined as TData;
  }

  return response.json() as Promise<TData>;
}

function getFilenameFromDisposition(disposition: string | null) {
  if (!disposition) {
    return undefined;
  }

  const match = disposition.match(/filename="?([^"]+)"?/i);

  return match?.[1];
}

export async function apiBlobRequest(
  path: string,
  options: RequestInit = {},
): Promise<{ blob: Blob; filename?: string }> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401 && canRefreshAuth(path) && (await refreshSession())) {
      const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
      });

      if (retryResponse.ok) {
        return {
          blob: await retryResponse.blob(),
          filename: getFilenameFromDisposition(retryResponse.headers.get("Content-Disposition")),
        };
      }

      throw await parseApiError(retryResponse);
    }

    throw await parseApiError(response);
  }

  return {
    blob: await response.blob(),
    filename: getFilenameFromDisposition(response.headers.get("Content-Disposition")),
  };
}
