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
import { useSearchParams } from "react-router-dom";

type BankListItem = {
  account_id: number;
  bank_name: string;
  user_name: string;
  account_number: string;
};

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

const normalizeBankData = (value: unknown): BankListItem[] => {
  if (!Array.isArray(value)) return bankMockData;
  const normalized = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Partial<BankListItem>;
      if (
        typeof candidate.account_id !== "number" ||
        typeof candidate.bank_name !== "string" ||
        typeof candidate.user_name !== "string" ||
        typeof candidate.account_number !== "string"
      ) {
        return null;
      }
      return {
        account_id: candidate.account_id,
        bank_name: candidate.bank_name,
        user_name: candidate.user_name,
        account_number: candidate.account_number,
      };
    })
    .filter((item): item is BankListItem => item !== null);

  return normalized.length > 0 ? normalized : bankMockData;
};

const ResultMemberPage = () => {
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

  const [bankData, setBankData] = useState<BankListItem[]>(bankMockData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const receiptResponse = await getReceiptListMember(settlementId);
        const normalizedReceipt = normalizeSettlementData(
          receiptResponse,
          settlementId
        );
        setSettlementData(normalizedReceipt);

        const managerId =
          normalizedReceipt.owner_id || settlementManagerData.owner_id;
        const bankResponse = await getBankList(managerId);
        setBankData(normalizeBankData(bankResponse));
      } catch (error) {
        console.error("참여자 정산 데이터 조회 실패", error);
      }
    };
    fetchData();
  }, [settlementId]);
  return (
    <SettleupResultPageLayout>
      <TitleWrapper>
        <TitleP>{settlementData.title}</TitleP>
      </TitleWrapper>
      <ContentSection>
        <WarningDiv>❗입금 시 입금자명은 참여 닉네임으로 해주세요.</WarningDiv>
        <ReceiptDiv>
          {(() => {
            const list = settlementData.data;
            const mine = list.find((d) => d.user === profile.nickname);
            const total = list.find((d) => /전체/.test(d.user));
            const others = list.filter((d) => d !== mine && d !== total);
            const ordered = [mine, total, ...others.filter(Boolean)];
            return ordered.filter(Boolean).map((entry) => (
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
