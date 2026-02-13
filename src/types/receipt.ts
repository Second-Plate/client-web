export type ItemType = {
  name: string;
  quantity: number;
  price: number;
};

export type DataType = {
  user: string;
  user_id: number;
  paid: boolean;
  items: ItemType[];
};

export type ReceiptDataType = {
  title: string;
  owner_id: number;
  settlement_id: number;
  data: DataType[];
};

export type AlarmDataType = {
  id: number;
  type:
    | "SETTLEMENT_COMPLETED"
    | "DEPOSIT_REQUEST"
    | "DEPOSIT_CANCELED"
    | "AWAITING_DEPOSIT"
    | "DEPOSIT_CONFIRMED";
  message: string;
  read: boolean;
  status: "AWAITING_DEPOSIT" | "IN_PROGRESS" | "DONE";
  role: "MEMBER" | "OWNER";
  created_at: string;
};

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  user: string;
  userId: number;
  items: ReceiptItem[];
}