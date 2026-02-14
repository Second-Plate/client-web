import styled from "styled-components";
import ReceiptDropdown from "../components/common/ReceiptDropdown";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProfileStore } from "../stores/profileStore";
import FloatingAlert from "../components/Result/FloatingAlert";
import { getReceiptListManager } from "../apis/reviewReceiptApi";
import settlementManagerData from "../mocks/settlementManagerData.json";
import type { ReceiptDataType } from "../types/receipt";

const normalizeSettlementData = (
  value: unknown,
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
        title: candidate.title ?? settlementManagerData.title,
        owner_id:
          typeof candidate.owner_id === "number"
            ? candidate.owner_id
            : settlementManagerData.owner_id,
        settlement_id:
          typeof candidate.settlement_id === "number"
            ? candidate.settlement_id
            : fallbackSettlementId,
        data: candidate.data as ReceiptDataType["data"],
      };
    }
  }
  return settlementManagerData;
};

const ResultManagerPage = () => {
  const [searchParams] = useSearchParams();
  const { profile } = useProfileStore();
  const parsedSettlementId = Number(searchParams.get("settlementId"));
  const settlementId =
    Number.isFinite(parsedSettlementId) && parsedSettlementId > 0
      ? parsedSettlementId
      : settlementManagerData.settlement_id;
  const [settlementData, setSettlementData] = useState<ReceiptDataType>(
    settlementManagerData
  );

  useEffect(() => {
    const fetchReceiptList = async () => {
      try {
        const data = await getReceiptListManager(settlementId);
        setSettlementData(normalizeSettlementData(data, settlementId));
      } catch (error) {
        console.error("정산 데이터 조회 실패", error);
      }
    };
    fetchReceiptList();
  }, [settlementId]);

  const [showAlert, setShowAlert] = useState(false);
  const [bonus, setBonus] = useState(0);

  const trigger = () => {
    setBonus(Math.floor(Math.random() * 900 + 100));
    setShowAlert(true);
  };

  useEffect(() => {
    if (!showAlert) return;
    const t = setTimeout(() => setShowAlert(false), 3000);
    return () => clearTimeout(t);
  }, [showAlert]);

  return (
    <SettleupResultPageLayout>
      <TitleWrapper>
        <TitleP>{settlementData?.title}</TitleP>
      </TitleWrapper>
      <ReceiptDiv>
        {(() => {
          const list = settlementData?.data || [];
          const mine = list.find((d) => d.user === profile.nickname);
          const total = list.find((d) => /전체/.test(d.user));
          const others = list.filter((d) => d !== mine && d !== total);
          const ordered = [mine, total, ...others.filter(Boolean)];
          return (
            <>
              {ordered.filter(Boolean).map((entry) => (
                <ReceiptDropdown
                  key={entry?.user}
                  initialPaid={entry?.paid}
                  settlementId={settlementData.settlement_id || settlementId}
                  data={{
                    user: entry!.user,
                    userId: entry!.user_id,
                    items: entry!.items,
                  }}
                />
              ))}
              <button onClick={trigger}>show floating alert</button>
            </>
          );
        })()}
      </ReceiptDiv>
      <FloatingAlert
        show={showAlert}
        message={`🍀${profile.nickname} 님 행운의 +${bonus}원 당첨!🍀`}
        onClose={() => setShowAlert(false)}
      />
    </SettleupResultPageLayout>
  );
};

export default ResultManagerPage;

export const SettleupResultPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #eeeeee;
`;

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding-top: 18px;
`;

const TitleP = styled.p`
  font-size: 20px;
  font-weight: 800;
`;

const ReceiptDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: auto;
  height: 100vh;
  width: 100%;
  margin: 24px 20px 0 20px;
  padding-top: 20px;
`;
