import styled from "styled-components";
import { MdNotInterested } from "react-icons/md";
import ReceiptDropdown from "../common/ReceiptDropdown";
import EmptyDropdown from "../common/EmptyDropdown";
import settlementManagerData from "../../mocks/settlementManagerData.json";
import { useProfileStore } from "../../stores/profileStore";

const ReceiptSection = () => {
  // TODO: api로 인원 제한 수 get 예정
  const { profile } = useProfileStore();
  const LIMIT = 6;
  const hap = 5;
  return (
    <ReceiptDiv>
      <TitleWrapper>
        <TitleP>참여자 영수증</TitleP>
        <WarningWrapper>
          <MdNotInterested style={{ fontSize: "16px", color: "#F44336" }} />
          <p style={{ color: "#F44336" }}>확정된 금액 아님</p>
        </WarningWrapper>
      </TitleWrapper>
      <ReceiptWrapper>
        {/* TODO: api 연결 예정 */}
        {/* <ReceiptDropdown data={dummyDataMe} />
        <ReceiptDropdown data={dummyDataEntire} />
        {dummyData2.map((it) => (
          <ReceiptDropdown key={it.user} data={it} />
        ))} */}
        {(() => {
          const list = settlementManagerData.data;
          const mine = list.find((d) => d.user === profile.nickname);
          const total = list.find((d) => /전체/.test(d.user));
          const others = list.filter((d) => d !== mine && d !== total);
          const ordered = [mine, total, ...others.filter(Boolean)];
          return ordered.filter(Boolean).map((entry) => (
            <ReceiptDropdown
              key={entry?.user}
              initialPaid={entry?.paid}
              data={{
                user: entry!.user,
                userId: entry!.user_id,
                items: entry!.items,
              }}
            />
          ));
        })()}
        {LIMIT - hap > 0 &&
          Array.from({ length: LIMIT - hap }).map((_, i) => (
            <EmptyDropdown key={`empty-${i}`} />
          ))}
      </ReceiptWrapper>
    </ReceiptDiv>
  );
};

export default ReceiptSection;

const ReceiptDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: #eeeeee;
  width: auto;
  height: 100vh;
  margin: 24px 20px 0 20px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  justify-content: space-around;
  align-items: end;
  gap: 120px;
  padding-top: 15px;
  padding-bottom: 2px;
  p {
    height: fit-content;
  }
`;

const TitleP = styled.p`
  font-size: 14px;
  font-weight: 800;
  margin: 0;
`;

const WarningWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: bold;
  color: "#F44336";
  height: 30px;
`;

const ReceiptWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
