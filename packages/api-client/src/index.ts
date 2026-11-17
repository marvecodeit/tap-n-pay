export * from "./types";

import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type {
  Card,
  ReconciliationReport,
  Student,
  StudentCreateRequest,
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

export function createTapNPayAxios(config: AxiosApiClientConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseUrl.replace(/\/$/, ""),
    timeout: config.timeoutMs ?? 15000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    if (config.authToken) {
      request.headers = request.headers ?? new AxiosHeaders();
      request.headers.set("Authorization", `Bearer ${config.authToken}`);
    }
    return request;
  });

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

  async reportCardLost(cardId: string): Promise<{ success: boolean; message: string }> {
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
