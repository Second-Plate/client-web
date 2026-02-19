import type { ReceiptDataType } from "../types/receipt";

export const normalizeSettlementData = (
  value: unknown,
  fallbackData: ReceiptDataType,
  fallbackSettlementId: number
): ReceiptDataType => {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "data" in value
  ) {
    const candidate = value as Partial<ReceiptDataType>;
    if (Array.isArray(candidate.data)) {
      return {
        title: candidate.title ?? fallbackData.title,
        owner_id:
          typeof candidate.owner_id === "number"
            ? candidate.owner_id
            : fallbackData.owner_id,
        settlement_id:
          typeof candidate.settlement_id === "number"
            ? candidate.settlement_id
            : fallbackSettlementId,
        data: candidate.data as ReceiptDataType["data"],
      };
    }
  }

  return fallbackData;
};
