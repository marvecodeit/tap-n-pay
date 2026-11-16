export type TransferRecipient = {
  name: string;
  matric: string;
  initials: string;
};

export type RecentTransfer = {
  id: string;
  description: string;
  date: string;
  amountNaira: number;
  direction: "in" | "out";
};

export const recentRecipients: TransferRecipient[];
export const recentTransfers: RecentTransfer[];
