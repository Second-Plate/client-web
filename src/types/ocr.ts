// Types used by OCR data processing

export interface StoreInfo {
  name: string;
  subName?: string;
  businessNumber?: string;
  address?: string;
  phoneNumber?: string;
}

export interface PaymentInfo {
  date: string; // formatted YYYY-MM-DD or raw text
  time: string; // formatted HH:mm:ss or raw text
  cardCompany?: string;
  cardNumber?: string;
  totalAmount: number; // parsed integer amount
}

export interface ReceiptItem {
  name: string;
  count: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ProcessedReceiptData {
  storeInfo: StoreInfo;
  paymentInfo: PaymentInfo;
  items: ReceiptItem[];
  // Keep raw OCR result for debugging or further processing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawData: any;
}export interface ReceiptItem {
  name: string;
  count: number;
  unitPrice: number;
  totalPrice: number;
}