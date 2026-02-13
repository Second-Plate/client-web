import React from "react";
import styled from "styled-components";

// 정산 데이터 타입
interface SettlementItem {
  name: string;
  quantity: number;
  price: number;
}

interface SettlementReceiptProps {
  title?: string;
  date?: string;
  items?: SettlementItem[];
}

export const Receipt: React.FC<SettlementReceiptProps> = ({
  title = "새로운 정산",
  date = "YYYY-MM-DD",
  items = [
    { name: "품목 1", quantity: 0, price: 0 }
  ]
}) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  // 동적 높이 계산
  const baseHeight = 73; // 헤더 영역 (정산명, 날짜, 구분선)
  const itemHeight = 38; // 각 품목 행의 높이
  const totalSectionHeight = 80; // 점선 + 총합 영역
  const totalHeight = baseHeight + (items.length * itemHeight) + totalSectionHeight;

  return (
    <ReceiptCard style={{ height: `${totalHeight}px` }}>
      <BackgroundSVG width="350" height={totalHeight - 10} viewBox={`0 0 350 ${totalHeight - 10}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={`M340 ${totalHeight-10}L330 ${totalHeight-19}L320 ${totalHeight-10}L310 ${totalHeight-19}L300 ${totalHeight-10}L290 ${totalHeight-19}L280 ${totalHeight-10}L270 ${totalHeight-19}L260 ${totalHeight-10}L250 ${totalHeight-19}L240 ${totalHeight-10}L230 ${totalHeight-19}L220 ${totalHeight-10}L210 ${totalHeight-19}L200 ${totalHeight-10}L190 ${totalHeight-19}L180 ${totalHeight-10}L170 ${totalHeight-19}L160 ${totalHeight-10}L150 ${totalHeight-19}L140 ${totalHeight-10}L130 ${totalHeight-19}L120 ${totalHeight-10}L110 ${totalHeight-19}L100 ${totalHeight-10}L90 ${totalHeight-19}L80 ${totalHeight-10}L70 ${totalHeight-19}L60 ${totalHeight-10}L50 ${totalHeight-19}L40 ${totalHeight-10}L30 ${totalHeight-19}L20 ${totalHeight-10}L10 ${totalHeight-19}L0 ${totalHeight-10}V5C0 2.23858 2.23858 1.50997e-08 5 0H345C347.761 0 350 2.23858 350 5V${totalHeight-19}L340 ${totalHeight-10}Z`} fill="white"/>
      </BackgroundSVG>
      <PaperClipIcon width="20" height="37" viewBox="0 0 20 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 17.5C9 16.9477 8.55228 16.5 8 16.5C7.44772 16.5 7 16.9477 7 17.5H8H9ZM1 11H2V8.5H1H0V11H1ZM18.5 8.5H17.5V31H18.5H19.5V8.5H18.5ZM8 31H9V17.5H8H7V31H8ZM1 8.5C2 8.5 2 8.50054 2 8.50106C2 8.50119 2 8.50168 2 8.50195C2 8.50248 2 8.50291 1.99999 8.50323C1.99999 8.50386 1.99999 8.50406 1.99999 8.50382C1.99999 8.50335 2.00002 8.50116 2.00009 8.4973C2.00024 8.48957 2.00058 8.4752 2.00138 8.45463C2.00298 8.41345 2.0064 8.34765 2.01364 8.26078C2.02814 8.08668 2.05784 7.83013 2.11833 7.51899C2.24008 6.8929 2.48206 6.06896 2.95753 5.25387C3.87036 3.68902 5.72725 2 9.75 2V1V0C5.02275 0 2.50464 2.06098 1.22997 4.24613C0.611689 5.30604 0.306799 6.3571 0.155103 7.13726C0.0788824 7.52925 0.0402153 7.85863 0.0205441 8.09469C0.0106937 8.21289 0.00556262 8.30823 0.00289155 8.37691C0.00155536 8.41127 0.000832738 8.43901 0.000444025 8.45967C0.000249635 8.47 0.000138644 8.47857 7.62428e-05 8.48531C4.50402e-05 8.48868 2.59804e-05 8.49159 1.47208e-05 8.49404C9.09088e-06 8.49527 5.41074e-06 8.49638 3.13805e-06 8.49737C2.07589e-06 8.49787 1.01791e-06 8.49852 7.16763e-07 8.49877C1.62893e-07 8.4994 0 8.5 1 8.5ZM9.75 1V2C13.7727 2 15.6296 3.68902 16.5425 5.25387C17.0179 6.06896 17.2599 6.8929 17.3817 7.51899C17.4422 7.83013 17.4719 8.08668 17.4864 8.26078C17.4936 8.34765 17.497 8.41345 17.4986 8.45463C17.4994 8.4752 17.4998 8.48957 17.4999 8.4973C17.5 8.50116 17.5 8.50335 17.5 8.50382C17.5 8.50406 17.5 8.50386 17.5 8.50323C17.5 8.50291 17.5 8.50248 17.5 8.50195C17.5 8.50168 17.5 8.50119 17.5 8.50106C17.5 8.50054 17.5 8.5 18.5 8.5C19.5 8.5 19.5 8.4994 19.5 8.49877C19.5 8.49852 19.5 8.49787 19.5 8.49737C19.5 8.49638 19.5 8.49527 19.5 8.49404C19.5 8.49159 19.5 8.48868 19.4999 8.48531C19.4999 8.47857 19.4998 8.47 19.4996 8.45967C19.4992 8.43901 19.4984 8.41127 19.4971 8.37691C19.4944 8.30823 19.4893 8.21289 19.4795 8.09469C19.4598 7.85863 19.4211 7.52925 19.3449 7.13726C19.1932 6.3571 18.8883 5.30604 18.27 4.24613C16.9954 2.06098 14.4773 0 9.75 0V1ZM18.5 31C17.5 31 17.5 30.9995 17.5 30.999C17.5 30.9989 17.5 30.9984 17.5 30.9982C17.5 30.9976 17.5 30.9972 17.5 30.9968C17.5 30.996 17.5 30.9955 17.5 30.9953C17.5 30.9949 17.5 30.9956 17.5 30.9974C17.4999 31.0011 17.4998 31.0091 17.4993 31.0212C17.4985 31.0454 17.4966 31.0858 17.4925 31.1401C17.4844 31.2489 17.4675 31.4112 17.4329 31.6089C17.363 32.0087 17.2249 32.5275 16.9584 33.0352C16.6944 33.5379 16.3116 34.0174 15.7491 34.3745C15.1907 34.7291 14.3972 35 13.25 35V36V37C14.7278 37 15.9031 36.6459 16.8212 36.063C17.7353 35.4826 18.3368 34.7121 18.7291 33.9648C19.1189 33.2225 19.3089 32.4913 19.403 31.9536C19.4504 31.6825 19.4746 31.4543 19.4869 31.2896C19.4931 31.2071 19.4964 31.1401 19.4981 31.0911C19.499 31.0666 19.4994 31.0466 19.4997 31.0313C19.4998 31.0236 19.4999 31.0172 19.4999 31.012C19.5 31.0093 19.5 31.007 19.5 31.005C19.5 31.004 19.5 31.0031 19.5 31.0023C19.5 31.0019 19.5 31.0013 19.5 31.0011C19.5 31.0005 19.5 31 18.5 31ZM13.25 36V35C12.1028 35 11.3093 34.7291 10.7509 34.3745C10.1884 34.0174 9.80558 33.5379 9.54165 33.0352C9.27515 32.5275 9.13703 32.0087 9.06706 31.6089C9.03247 31.4112 9.01561 31.2489 9.00745 31.1401C9.00339 31.0858 9.00152 31.0454 9.00067 31.0212C9.00025 31.0091 9.00008 31.0011 9.00002 30.9974C8.99999 30.9956 8.99998 30.9949 8.99999 30.9953C8.99999 30.9955 8.99999 30.996 8.99999 30.9968C9 30.9972 9 30.9976 9 30.9982C9 30.9984 9 30.9989 9 30.999C9 30.9995 9 31 8 31C7 31 7 31.0005 7 31.0011C7 31.0013 7 31.0019 7 31.0023C7 31.0031 7.00001 31.004 7.00001 31.005C7.00002 31.007 7.00003 31.0093 7.00005 31.012C7.0001 31.0172 7.00017 31.0236 7.0003 31.0313C7.00056 31.0466 7.00104 31.0666 7.00189 31.0911C7.00361 31.1401 7.00687 31.2071 7.01305 31.2896C7.0254 31.4543 7.04956 31.6825 7.097 31.9536C7.1911 32.4913 7.3811 33.2225 7.77085 33.9648C8.16317 34.7121 8.7647 35.4826 9.67884 36.063C10.5969 36.6459 11.7722 37 13.25 37V36Z" fill="#F44336"/>
      </PaperClipIcon>

      <ContentContainer>
        <ReceiptHeader>
          <SettlementLabel>정산명</SettlementLabel>
          <ReceiptTitle>{title}</ReceiptTitle>
          <ReceiptDate>{date}</ReceiptDate>
        </ReceiptHeader>

        <DividerLine />

        <ItemsList>
          {items.map((item, index) => (
            <ItemRow key={index} style={{ top: 84 + (index * 38) }}>
              <ItemName>{item.name}</ItemName>
              <ItemQuantity>{item.quantity} 개</ItemQuantity>
              <ItemPrice>{item.price.toLocaleString()} 원</ItemPrice>
            </ItemRow>
          ))}
        </ItemsList>

        <DottedLine style={{ top: `${baseHeight + (items.length * itemHeight)}px` }} />

        <TotalRow style={{ top: `${baseHeight + (items.length * itemHeight) + 16}px` }}>
          <TotalLabel>총합</TotalLabel>
          <TotalQuantity>{totalQuantity} 개</TotalQuantity>
          <TotalPrice>{totalPrice.toLocaleString()} 원</TotalPrice>
        </TotalRow>
      </ContentContainer>
    </ReceiptCard>
  );
};

// 메인 컨테이너
const ReceiptCard = styled.div`
  width: 350px;
  position: relative;
  overflow: hidden;
`;

// 배경 SVG 컴포넌트
const BackgroundSVG = styled.svg`
  position: absolute;
  top: 5px;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

// 종이클립 아이콘
const PaperClipIcon = styled.svg`
  width: 20px;
  height: 37px;
  position: absolute;
  right: 14px;
  top: 0px;
  z-index: 1;
`;

// 콘텐츠 컨테이너
const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

// 영수증 헤더
const ReceiptHeader = styled.div`
  position: relative;
`;

// 정산명 라벨
const SettlementLabel = styled.span`
  color: #6B6B6B;
  font-size: 10px;
  font-family: "NanumSquare", sans-serif;
  font-weight: 800;
  line-height: 13px;
  position: absolute;
  left: 14px;
  top: 28px;
  z-index: 2;
`;

// 정산 제목
const ReceiptTitle = styled.span`
  color: black;
  font-size: 14px;
  font-family: "NanumSquare", sans-serif;
  font-weight: 800;
  line-height: 18.20px;
  position: absolute;
  left: 14px;
  top: 45px;
  z-index: 2;
`;

// 날짜
const ReceiptDate = styled.span`
  color: black;
  font-size: 11px;
  font-family: "NanumSquare", sans-serif;
  font-weight: 800;
  line-height: 14.30px;
  position: absolute;
  right: 14px;
  top: 48px;
  z-index: 2;
`;

// 구분선
const DividerLine = styled.div`
  width: 322px;
  height: 2px;
  background-color: black;
  position: absolute;
  left: 14px;
  top: 73px;
  z-index: 2;
`;

// 점선 구분선
const DottedLine = styled.div`
  width: 322px;
  height: 1px;
  border-top: 2px dashed black;
  position: absolute;
  left: 14px;
  z-index: 2;
`;

// 품목 리스트
const ItemsList = styled.div`
  position: relative;
`;

// 품목 행 
const ItemRow = styled.div`
  width: 305px;
  height: 16px;
  position: absolute;
  left: 20px;
  display: grid;
  grid-template-columns: 1fr 60px 80px;
  gap: 10px;
  align-items: center;
  z-index: 2;
`;

// 품목명 - 왼쪽 정렬
const ItemName = styled.span`
  color: black;
  font-size: 12px;
  font-family: "NanumSquare", sans-serif;
  font-weight: 700;
  line-height: 15.60px;
  text-align: left;
  z-index: 2;
`;

// 수량 - 중앙 정렬
const ItemQuantity = styled.span`
  color: black;
  font-size: 12px;
  font-family: "NanumSquare", sans-serif;
  font-weight: 700;
  line-height: 15.60px;
  text-align: center;
  z-index: 2;
`;

// 가격 - 오른쪽 정렬
const ItemPrice = styled.span`
  color: black;
  font-size: 12px;
  font-family: "NanumSquare", sans-serif;
  font-weight: 700;
  line-height: 15.60px;
  text-align: right;
  z-index: 2;
`;

// 총합 행
const TotalRow = styled.div`
  width: 305px;
  height: 16px;
  position: absolute;
  left: 20px;
  display: grid;
  grid-template-columns: 1fr 60px 80px;
  gap: 10px;
  align-items: center;
  z-index: 2;
  margin-bottom: 20px;
`;

// 총합 - 왼쪽 정렬
const TotalLabel = styled.span`
  color: black;
  font-size: 12px;
  font-family: "NanumSquare", sans-serif;
  font-weight: 800;
  line-height: 15.60px;
  text-align: left;
  z-index: 2;
`;

// 총합 개수 - 중앙 정렬
const TotalQuantity = styled.span`
  color: black;
  font-size: 12px;
  font-family: "NanumSquare", sans-serif;
  font-weight: 800;
  line-height: 15.60px;
  text-align: center;
  z-index: 2;
`;

// 총합 가격 - 오른쪽 정렬
const TotalPrice = styled.span`
  color: black;
  font-size: 12px;
  font-family: "NanumSquare", sans-serif;
  font-weight: 800;
  line-height: 15.60px;
  text-align: right;
  z-index: 2;
`;