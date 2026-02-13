import styled from "styled-components";
// import DashboardCard from "../components/common/DashboardCard";
import ProgressbarCard from "../components/common/ProgressbarCard";
import ReceiptSection from "../components/ReviewReceipt/ReceiptSection";
import Carousel from "../components/ReviewReceipt/Carousel";
import SettleupSection from "../components/ReviewReceipt/SettleupSection";
import { IoShareSocialOutline } from "react-icons/io5";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { postParticipateCode } from "../apis/reviewReceiptApi";
import LinkShareModal from "../components/ReviewReceipt/LinkShareModal";
import BottomNav from "../components/common/BottomNav";
import { useNavigate } from "react-router-dom";

export const dummyDataMe = {
  user: "이채영",
  items: [
    { name: "콜라", quantity: 2, price: 1500 },
    { name: "치킨", quantity: 1, price: 18000 },
  ],
};

export const dummyDataEntire = {
  user: "전체",
  items: [
    { name: "콜라", quantity: 8, price: 6000 },
    { name: "치킨", quantity: 5, price: 72000 },
  ],
};

export const dummyData2 = [
  {
    user: "김짱돌",
    items: [
      { name: "콜라", quantity: 2, price: 1500 },
      { name: "치킨", quantity: 1, price: 18000 },
    ],
  },
  {
    user: "홍길동",
    items: [
      { name: "콜라", quantity: 2, price: 1500 },
      { name: "치킨", quantity: 1, price: 18000 },
    ],
  },
  {
    user: "최마루",
    items: [
      { name: "콜라", quantity: 2, price: 1500 },
      { name: "치킨", quantity: 1, price: 18000 },
    ],
  },
];

const ReviewReceiptPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareCode, setShareCode] = useState<string | undefined>("ABC123");
  const [shareUrl, setShareUrl] = useState<string | undefined>(
    "https://www.naver.com"
  );
  const [searchParams] = useSearchParams();
  const settlementIdParam = searchParams.get("settlementId");
  const settlementId = settlementIdParam
    ? Number(settlementIdParam)
    : undefined;

  const handleShareClick = useCallback(async () => {
    try {
      if (!settlementId || Number.isNaN(settlementId)) {
        console.warn("settlementId 가 유효하지 않습니다.", settlementIdParam);
        setIsModalOpen(true); // fallback: 일단 모달은 띄움 (기본 코드 노출)
        return;
      }
      const res = await postParticipateCode(settlementId);
      // API 응답 형태에 따라 code 위치 방어적으로 처리
      const code: string | undefined = (res && (res.code ?? res.data?.code)) as
        | string
        | undefined;
      if (code) setShareCode(code);

      const url: string | undefined = (res && (res.url ?? res.data?.url)) as
        | string
        | undefined;
      if (url) setShareUrl(url);
      setIsModalOpen(true);
    } catch (e) {
      console.error("공유 코드 생성 실패", e);
      setIsModalOpen(true); // 실패해도 안내 모달은 노출 (기본 코드)
    }
  }, [settlementId, settlementIdParam]);

  return (
    <ReviewReceiptPageLayout>
      <TitleWrapper>
        <TitleP>정산명</TitleP>
        <IoShareSocialOutline
          style={{ fontSize: 18, cursor: "pointer" }}
          onClick={handleShareClick}
        />
      </TitleWrapper>
      <DashboardDiv>
        {/* TODO: api 연결 예정 */}
        <ProgressbarCard complete={5} incomplete={3} />
      </DashboardDiv>
      <Carousel>
        <ReceiptSection />
        <SettleupSection />
      </Carousel>
      <LinkShareModal
        open={isModalOpen}
        code={shareCode}
        url={shareUrl ?? ""}
        onClose={() => setIsModalOpen(false)}
      />
      <BottomNav
        description="밑으로 당겨서 새로고침할 수 있습니다."
        primaryLabel="정산 완료하기"
        onPrimaryClick={() => navigate("/finish")}
      />
    </ReviewReceiptPageLayout>
  );
};

export default ReviewReceiptPage;

const ReviewReceiptPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  & > svg {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const TitleP = styled.p`
  font-size: 20px;
  font-weight: 800;
`;

const DashboardDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  margin: 0 22px;
`;
