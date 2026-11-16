export * from "./types";

export interface ApiClientConfig {
  baseUrl: string;
  authToken?: string;
}

export class TapNPayApiClient {
  private baseUrl: string;
  private authToken?: string;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.authToken = config.authToken;
  }

  setToken(token: string) {
    this.authToken = token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // Sync endpoint
  async syncBatch(batch: import("./types").SyncUploadBatch): Promise<import("./types").SyncResponse> {
    return this.request("/api/v1/sync", {
      method: "POST",
      body: JSON.stringify(batch),
    });
  }

  // Student endpoints
  async getStudent(studentId: string): Promise<import("./types").Student> {
    return this.request(`/api/v1/students/${studentId}`);
  }

  async getTransactions(cardId: string): Promise<import("./types").Transaction[]> {
    return this.request(`/api/v1/transactions?card_id=${cardId}`);
  }

  async reportCardLost(cardId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/v1/cards/${cardId}/report-lost`, {
      method: "POST",
    });
  }

  // Admin endpoints
  async getReconciliation(): Promise<import("./types").ReconciliationReport> {
    return this.request("/api/v1/admin/reconciliation");
  }

  async listCards(): Promise<import("./types").Card[]> {
    return this.request("/api/v1/admin/cards");
  }

  async issueCard(studentId: string, cardId: string, initialBalanceKobo = 0): Promise<import("./types").Card> {
    return this.request("/api/v1/admin/cards", {
      method: "POST",
      body: JSON.stringify({ student_id: studentId, card_id: cardId, balance: initialBalanceKobo }),
    });
  }
}
