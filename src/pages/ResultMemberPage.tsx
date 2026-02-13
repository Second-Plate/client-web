import styled from "styled-components";
import ReceiptDropdown from "../components/common/ReceiptDropdown";
import AccountListItem from "../components/Result/AccountListItem";
import settlementManagerData from "../mocks/settlementManagerData.json";
import { SettleupResultPageLayout, TitleWrapper } from "./ResultManagerPage";
import { getReceiptListMember, getBankList } from "../apis/reviewReceiptApi";
import type { ReceiptDataType } from "../types/receipt";
import bankMockData from "../mocks/bankData.json";
import { useEffect, useState } from "react";
import { useProfileStore } from "../stores/profileStore";

type BankListItem = {
  account_id: number;
  bank_name: string;
  user_name: string;
  account_number: string;
};

const ResultMemberPage = () => {
  const { profile } = useProfileStore();
  const [settlementData, setSettlementData] = useState<ReceiptDataType>(
    settlementManagerData
  );

  const [bankData, setBankData] = useState<BankListItem[]>(bankMockData);
  useEffect(() => {
    const fetchReceiptList = async () => {
      // TODO: settlementId 연결
      const data = await getReceiptListMember(0);
      setSettlementData(
        (data || []).map((it: any) => ({
          ...it,
        }))
      );
    };
    fetchReceiptList();

    const fetchBankList = async () => {
      const data = await getBankList(111);
      setBankData(
        (data || []).map((it: any) => ({
          ...it,
        }))
      );
    };
    fetchBankList();
  }, []);
  return (
    <SettleupResultPageLayout>
      <TitleWrapper>
        <TitleP>하나로마트 정산</TitleP>
      </TitleWrapper>
      <ContentSection>
        <WarningDiv>❗입금 시 입금자명은 참여 닉네임으로 해주세요.</WarningDiv>
        <ReceiptDiv>
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
        </ReceiptDiv>
        <AccountDiv>
          <p>입금 계좌</p>
          {bankData.map((it) => {
            return (
              <AccountListItem
                key={it.account_id}
                bank={it.bank_name}
                accountNumber={it.account_number}
                owner={it.user_name}
              />
            );
          })}
        </AccountDiv>
      </ContentSection>
    </SettleupResultPageLayout>
  );
};

export default ResultMemberPage;

const TitleP = styled.p`
  font-size: 20px;
  font-weight: 800;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: #eeeeee;
  width: auto;
  height: 100vh;
  width: 100%;
  margin: 0 20px 0 20px;
  padding-top: 20px;
`;

const WarningDiv = styled.div`
  width: 350px;
  padding: 6px 0 6px 3px;
  margin-bottom: 10px;
  background-color: #ffffd0;
  color: #f44336;
  font-size: 12px;
  font-weight: 800;
`;

const ReceiptDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccountDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;

  p {
    font-size: 14px;
    font-weight: 800;
    margin-bottom: 5px;
  }
`;
