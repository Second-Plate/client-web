import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProfileStore } from "../stores/profileStore";
import FloatingAlert from "../components/Result/FloatingAlert";
import OrderedReceiptDropdownList from "../components/Result/OrderedReceiptDropdownList";
import HomeIconButton from "../components/common/HomeIconButton";
import BackIconButton from "../components/common/BackIconButton";
import { getReceiptListManager } from "../apis/reviewReceiptApi";
import settlementManagerData from "../mocks/settlementManagerData.json";
import type { ReceiptDataType } from "../types/receipt";
import { normalizeSettlementData } from "../utils/settlement";

const ResultManagerPage = () => {
  const navigate = useNavigate();
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
        setSettlementData(
          normalizeSettlementData(data, settlementManagerData, settlementId)
        );
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
  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/home");
  };

  useEffect(() => {
    if (!showAlert) return;
    const t = setTimeout(() => setShowAlert(false), 3000);
    return () => clearTimeout(t);
  }, [showAlert]);

  return (
    <SettleupResultPageLayout>
      <TitleWrapper>
        <BackIconButton onClick={handleBackClick} inHeader />
        <TitleP>{settlementData?.title}</TitleP>
        <HomeIconButton onClick={() => navigate("/home")} />
      </TitleWrapper>
      <ReceiptDiv>
        <OrderedReceiptDropdownList
          entries={settlementData.data}
          nickname={profile.nickname}
          settlementId={settlementData.settlement_id || settlementId}
        />
        <button onClick={trigger}>show floating alert</button>
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
