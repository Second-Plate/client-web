import { axiosInstance } from "../apis/axiosInstance";

export const getOngoingSettlement = async (userId: string | number) => {
  try {
    const res = await axiosInstance.get("api/v1/settlements/ongoing", {
      params: { userId },
    });
    console.log("성공~~: ", res.data);
    return res.data;
  } catch (error) {
    console.error("진행중 데이터 get 에러", error);
    throw error;
  }
};

export const getCompletedSettlement = async (userId: string | number) => {
  try {
    const res = await axiosInstance.get("api/v1/settlements/completed", {
      params: { userId },
    });
    return res.data;
  } catch (error) {
    console.error("완료된 데이터 get 에러", error);
    throw error;
  }
};

// 알림 리스트
export const getAlarmList = async (userId: string | number) => {
  try {
    const res = await axiosInstance.get("api/v1/notifications", {
      params: { userId },
    });
    return res.data;
  } catch (error) {
    console.error("알림리스트 get 에러", error);
    throw error;
  }
};
