export * from "./types";

import axios, {
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import type {
  AuthTokenResponse,
  AuthenticatedStudent,
  Card,
  ReconciliationReport,
  Student,
  StudentCreateRequest,
  StudentLoginRequest,
  StudentRegistrationRequest,
  StudentRegistrationResponse,
  StudentWalletResponse,
  SyncResponse,
  SyncUploadBatch,
  Transaction,
  TopUpInitResponse,
  TopUpRequest,
} from "./types";

export interface AxiosApiClientConfig {
  baseUrl: string;
  authToken?: string;
  timeoutMs?: number;
}

export function isTapNPayUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function getTapNPayErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  if (!error.response) return "Unable to reach the TapNPay API. Try again.";
  return fallback;
}

export function createTapNPayAxios(config: AxiosApiClientConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseUrl.replace(/\/$/, ""),
    timeout: config.timeoutMs ?? 15000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  if (config.authToken) {
    client.defaults.headers.common.Authorization = `Bearer ${config.authToken}`;
  }

  return client;
}

export class TapNPayAxiosClient {
  readonly axios: AxiosInstance;

  constructor(config: AxiosApiClientConfig) {
    this.axios = createTapNPayAxios(config);
  }

  setToken(token: string) {
    this.axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  clearToken() {
    delete this.axios.defaults.headers.common.Authorization;
  }

  async registerStudent(
    payload: StudentRegistrationRequest,
  ): Promise<StudentRegistrationResponse> {
    const formData = new FormData();
    formData.append("profileImage", payload.profileImage);
    for (const [key, value] of Object.entries(payload)) {
      if (key !== "profileImage") formData.append(key, value);
    }

    const response = await this.axios.post<StudentRegistrationResponse>(
      "/api/auth/register",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  }

  async login(payload: StudentLoginRequest): Promise<AuthTokenResponse> {
    const response = await this.axios.post<AuthTokenResponse>(
      "/api/auth/login",
      payload,
    );
    return response.data;
  }

  async refresh(): Promise<AuthTokenResponse> {
    const response = await this.axios.post<AuthTokenResponse>(
      "/api/auth/refresh",
    );
    return response.data;
  }

  async getCurrentStudent(): Promise<AuthenticatedStudent> {
    const response = await this.axios.get<AuthenticatedStudent>("/api/auth/me");
    return response.data;
  }

  async uploadStudentProfileImage(
    profileImage: File,
  ): Promise<{ profile_image_url: string | null; is_profile_complete: boolean }> {
    const formData = new FormData();
    formData.append("profileImage", profileImage);

    const response = await this.axios.post<{
      profile_image_url: string | null;
      is_profile_complete: boolean;
    }>("/api/auth/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async getStudentWallet(): Promise<StudentWalletResponse> {
    const response = await this.axios.get<StudentWalletResponse>(
      "/api/auth/wallet",
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await this.axios.post("/api/auth/logout");
  }

  async createStudent(payload: StudentCreateRequest): Promise<Student> {
    const response: AxiosResponse<Student> = await this.axios.post(
      "/api/v1/students",
      payload,
    );
    return response.data;
  }

  async getStudent(studentId: string): Promise<Student> {
    const response: AxiosResponse<Student> = await this.axios.get(
      `/api/v1/students/${encodeURIComponent(studentId)}`,
    );
    return response.data;
  }

  async syncBatch(batch: SyncUploadBatch): Promise<SyncResponse> {
    const response: AxiosResponse<SyncResponse> = await this.axios.post(
      "/api/v1/sync",
      batch,
    );
    return response.data;
  }

  async getTransactions(cardId: string): Promise<Transaction[]> {
    const response: AxiosResponse<Transaction[]> = await this.axios.get(
      "/api/v1/transactions",
      { params: { card_id: cardId } },
    );
    return response.data;
  }

  async reportCardLost(
    cardId: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.axios.post(
      `/api/v1/cards/${encodeURIComponent(cardId)}/report-lost`,
    );
    return response.data;
  }

  async getReconciliation(): Promise<ReconciliationReport> {
    const response: AxiosResponse<ReconciliationReport> = await this.axios.get(
      "/api/v1/admin/reconciliation",
    );
    return response.data;
  }

  async listCards(): Promise<Card[]> {
    const response: AxiosResponse<Card[]> = await this.axios.get(
      "/api/v1/admin/cards",
    );
    return response.data;
  }

  async issueCard(
    studentId: string,
    cardId: string,
    initialBalanceKobo = 0,
  ): Promise<Card> {
    const response: AxiosResponse<Card> = await this.axios.post(
      "/api/v1/admin/cards",
      {
        student_id: studentId,
        card_id: cardId,
        balance: initialBalanceKobo,
      },
    );
    return response.data;
  }

  async initTopUp(payload: TopUpRequest): Promise<TopUpInitResponse> {
    const response: AxiosResponse<TopUpInitResponse> = await this.axios.post(
      "/api/v1/topups/init",
      payload,
    );
    return response.data;
  }
}
