import { axiosInstance } from "./axiosInstance";

export const getReceiptListMember = async (settlementId: string | number) => {
  try {
    const res = await axiosInstance.get("/api/v1/receipts/member", {
      params: { settlementId },
    });
    return res.data;
  } catch (error) {
    console.error("getReceiptListMember 에러", error);
    throw error;
  }
};

// 관리자용 영수증 리스트 조회
export const getReceiptListManager = async (settlementId: string | number) => {
  try {
    const res = await axiosInstance.get("/api/v1/receipts/manager", {
      params: { settlementId },
    });
    return res.data;
  } catch (error) {
    console.error("getReceiptListManager 에러", error);
    throw error;
  }
};

// 은행 목록 조회
export const getBankList = async (managerId: number) => {
  try {
    const res = await axiosInstance.get("/api/v1/banks", {
      params: { managerId },
    });
    return res.data;
  } catch (error) {
    console.error("getBankList 에러", error);
    throw error;
  }
};

// 참여자 기준 입금 상태 변경
export const postChangeDepositState = async (
  settlementId: number,
  userId: number
) => {
  try {
    const res = await axiosInstance.post("/api/v1/banks", {
      params: { settlementId, userId },
    });
    return res.data;
  } catch (error) {
    console.error("postChangeDepositState 에러", error);
    throw error;
  }
};

// 독촉하기
export const postUrge = async (userId: number) => {
  try {
    const res = await axiosInstance.post("/api/v1/banks", {
      params: { userId },
    });
    return res.data;
  } catch (error) {
    console.error("postUrge 에러", error);
    throw error;
  }
};

// 관리자 기준 입금 상태 변경
export const postChangeDepositStateManager = async (
  settlementId: number,
  userId: number
) => {
  try {
    const res = await axiosInstance.post("/api/v1/banks", {
      params: { settlementId, userId },
    });
    return res.data;
  } catch (error) {
    console.error("postChangeDepositStateManager 에러", error);
    throw error;
  }
};

// 공유하기(참여코드생성)
export const postParticipateCode = async (settlementId: number) => {
  try {
    const res = await axiosInstance.post(`/api/v1/settlements/${settlementId}/invites`);
    return res.data;
  } catch (error) {
    console.error("postParticipateCode 에러", error);
    throw error;
  }
};
