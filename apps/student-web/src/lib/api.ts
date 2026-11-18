import {
  getTapNPayErrorMessage,
  isTapNPayUnauthorizedError,
  TapNPayAxiosClient,
} from "@tapnpay/api-client";

export const api = new TapNPayAxiosClient({
  baseUrl: import.meta.env.VITE_API_URL?.trim() || "",
});

api.axios.interceptors.request.use((request) => {
  if (!import.meta.env.VITE_API_URL?.trim()) {
    return Promise.reject(
      new Error(
        "Set VITE_API_URL in apps/student-web/.env to your NestJS API URL, then restart the student web app.",
      ),
    );
  }
  return request;
});

let refreshRequest: Promise<void> | null = null;

export function refreshStudentSession(): Promise<void> {
  if (!refreshRequest) {
    refreshRequest = api
      .refresh()
      .then(({ accessToken }) => api.setToken(accessToken))
      .finally(() => {
        refreshRequest = null;
      });
  }
  return refreshRequest;
}

export function isUnauthorizedApiError(error: unknown): boolean {
  return isTapNPayUnauthorizedError(error);
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return getTapNPayErrorMessage(error, fallback);
}
