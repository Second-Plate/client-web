// 알림 type별 아이콘 경로 매핑 (icons 폴더 내 동일 이름 svg)
export const ALARM_TYPE_ICON: Record<string, string> = {
  SETTLEMENT_COMPLETED: "/src/assets/icons/settlement_complete_icon.svg",
  DEPOSIT_REQUEST: "/src/assets/icons/deposit_request_icon.svg",
  DEPOSIT_CANCELED: "/src/assets/icons/deposit_canceled_icon.svg",
  DEPOSIT_CONFIRMED: "/src/assets/icons/settlement_complete_icon.svg",
  SETTLEMENT_COMPLETE_REQUEST:
    "/src/assets/icons/settle_complete_request_icon.svg",
};
export const SETTLEMENT_STATUS_LABEL = {
  IN_PROGRESS: "정산진행중",
  AWAITING_DEPOSIT: "입금 필요",
  NEEDS_ATTENTION: "관리 필요",
  DONE: "종료",
};

// SETTLEMENT_COMPLETED,       // 정산 완료 (사용자)
// DEPOSIT_REQUEST,            // 독촉 (사용자에게)
// DEPOSIT_CANCELED,           // 입금취소 (사용자)

// DEPOSIT_CONFIRMED,          // 누가입금함 (관리자에게)
// SETTLEMENT_COMPLETE_REQUEST // 정산 완료 처리 요청 (관리자에게)
