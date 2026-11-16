import type { Card } from "@tapnpay/api-client";

export const demoCards: Card[] = [
  {
    card_id: "CARD-A3F2-9K2",
    student_id: "AUL/CMP/23/044",
    student_name: "John Okafor",
    balance: 50_000_000,
    version: 1,
    blocked: 0,
    issued_at: new Date().toISOString(),
  },
  {
    card_id: "CARD-7B4C-1L9",
    student_id: "AUL/ECO/22/087",
    student_name: "Fatima Aliyu",
    balance: 500000,
    version: 1,
    blocked: 0,
    issued_at: new Date().toISOString(),
  },
  {
    card_id: "CARD-2E8M-5Q4",
    student_id: "AUL/EEE/24/126",
    student_name: "Chinedu Eze",
    balance: 40000,
    version: 1,
    blocked: 0,
    issued_at: new Date().toISOString(),
  },
  {
    card_id: "CARD-BLOCKED-99",
    student_id: "AUL/ACC/21/039",
    student_name: "Tunde Bakare",
    balance: 350000,
    version: 1,
    blocked: 1,
    issued_at: new Date().toISOString(),
  },
];

export const demoStudentDetails: Record<
  string,
  { department: string; course: string }
> = {
  "AUL/CMP/23/044": { department: "Computer Science", course: "B.Sc. Computer Science" },
  "AUL/ECO/22/087": { department: "Economics", course: "B.Sc. Economics" },
  "AUL/EEE/24/126": {
    department: "Electrical Engineering",
    course: "B.Eng. Electrical Engineering",
  },
  "AUL/ACC/21/039": { department: "Accounting", course: "B.Sc. Accounting" },
};
