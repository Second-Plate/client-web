import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Receipt } from "../ReceiptConfirm/Receipt";
import receiptData from "../../data/receiptData.json";
import TopNav from "../../components/common/TopNav";
import BottomNav from "../../components/common/BottomNav";

const ReceiptConfirm = () => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate("/receiptedit"); 
  };

  const handleSettlementClick = () => {
    navigate("/selectpeoplecount"); 
  };

  return (
    <ReceiptLayout>
      <TopNav 
        title="영수증 미리보기"
        showBackButton={false}
        onBackClick={() => {}}
      />
      <ReceiptContainer>
        {/* 더미데이터 사용 */}
        <Receipt 
          title={receiptData.title}
          date={receiptData.date}
          items={receiptData.items}
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