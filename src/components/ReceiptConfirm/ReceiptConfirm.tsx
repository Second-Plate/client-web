import styled from "styled-components";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Receipt } from "../ReceiptConfirm/Receipt";
import receiptData from "../../data/receiptData.json";
import TopNav from "../../components/common/TopNav";
import BottomNav from "../../components/common/BottomNav";
import type { ReceiptData as OCRReceiptData } from "../../apis/ocrApi";
import type { ReceiptItem } from "../../types/receipt";

type ReceiptConfirmState = {
  receiptData?: OCRReceiptData;
  originalImage?: File | null;
  participantCount?: number;
  settlementId?: number;
};

const ReceiptConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as ReceiptConfirmState;

  const receiptPreview = useMemo(() => {
    const ocrReceipt = state.receiptData;
    if (!ocrReceipt) return receiptData;

    const mappedItems: ReceiptItem[] = (ocrReceipt.items || []).map((item) => ({
      name: item.name,
      quantity: item.count,
      price: item.totalPrice || item.unitPrice,
    }));

    return {
      title: ocrReceipt.storeName || receiptData.title,
      date: ocrReceipt.date || receiptData.date,
      items: mappedItems.length > 0 ? mappedItems : receiptData.items,
    };
  }, [state.receiptData]);

  const handleEditClick = () => {
    navigate("/receiptedit", {
      state,
    });
  };

  const handleSettlementClick = () => {
    navigate("/selectpeoplecount", {
      state,
    });
  };

  return (
    <ReceiptLayout>
      <TopNav 
        title="영수증 미리보기"
        showBackButton={false}
        onBackClick={() => {}}
      />
      <ReceiptContainer>
        <Receipt 
          title={receiptPreview.title}
          date={receiptPreview.date}
          items={receiptPreview.items}
        />
      </ReceiptContainer>
      <BottomNav 
        description="추출된 영수증을 확인해 주세요."
        primaryLabel="편집하기"
        onPrimaryClick={handleEditClick}
        secondaryLabel="정산하러 가기"
        onSecondaryClick={handleSettlementClick}
      />
    </ReceiptLayout>
  );
};

export default ReceiptConfirm;

const ReceiptLayout = styled.div`
  background-color: #eeeeee;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow: hidden;
`;

const ReceiptContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 30px;
  width: 100%;
   &::-webkit-scrollbar {
    width: 0.1px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;
