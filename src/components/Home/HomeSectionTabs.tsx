import styled, { css } from "styled-components";
import { useState, useMemo, useEffect } from "react";
import { useProfileStore } from "../../stores/profileStore";
import InProgressItem from "./InProgressItem";
import type { StatusType } from "./InProgressItem";
import { SETTLEMENT_STATUS_LABEL } from "../../constants/status";
import {
  getOngoingSettlement,
  getCompletedSettlement,
} from "../../apis/homeApi";
import homeData from "../../mocks/homeData.json";
import homedoneData from "../../mocks/homedoneData.json";

type HomeDataItem = {
  settlement_id: string;
  title: string;
  created_at: string;
  status: string;
  role: string;
};

const HomeSectionTabs = () => {
  const { profile } = useProfileStore();
  const [ongoingData, setOngoingData] = useState<HomeDataItem[]>(
    homeData.map((it) => ({
      ...it,
      settlement_id: String(it.settlement_id),
    }))
  );
  const [completedData, setCompletedData] = useState<HomeDataItem[]>(
    homedoneData.map((it) => ({
      ...it,
      settlement_id: String(it.settlement_id),
    }))
  );

  useEffect(() => {
    const fetchOngoingSettlemnet = async () => {
      const data = await getOngoingSettlement(profile.userId);
      setOngoingData(
        (data || []).map((it: any) => ({
          ...it,
          settlement_id: String(it.settlement_id),
        }))
      );
    };
    const fetchCompletedSettlement = async () => {
      const data = await getCompletedSettlement(profile.userId);
      setCompletedData(
        (data || []).map((it: any) => ({
          ...it,
          settlement_id: String(it.settlement_id),
        }))
      );
    };

    fetchOngoingSettlemnet();
    fetchCompletedSettlement();
  }, []);
  const [tab, setTab] = useState<"inprogress" | "done">("inprogress");

  const list = useMemo(() => {
    return tab === "done" ? completedData : ongoingData;
  }, [tab, ongoingData, completedData]);

  const formatDate = (value: string | number | Date) => {
    let d =
      typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : new Date(value.getTime());
    if (isNaN(d.getTime()) && typeof value === "string") {
      d = new Date(value.replace(" ", "T"));
    }
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${mm}.${dd}`;
  };

  return (
    <TabsWrapper>
      <TabsBar>
        <TabButton
          $active={tab === "inprogress"}
          onClick={() => setTab("inprogress")}
        >
          진행중
        </TabButton>
        <TabButton $active={tab === "done"} onClick={() => setTab("done")}>
          종료
        </TabButton>
        <Indicator $index={tab === "inprogress" ? 0 : 1} />
      </TabsBar>
      <TabPanel>
        {list.map((it) => {
          const label =
            SETTLEMENT_STATUS_LABEL[
              it.status as keyof typeof SETTLEMENT_STATUS_LABEL
            ];
          return (
            <InProgressItem
              key={it.settlement_id}
              title={it.title}
              dueDate={formatDate(it.created_at as string)}
              status={label as StatusType}
              settlementId={it.settlement_id}
              role={it.role === "OWNER" ? "OWNER" : "MEMBER"}
            />
          );
        })}
        {list.length === 0 && <EmptyText>표시할 정산이 없습니다.</EmptyText>}
      </TabPanel>
    </TabsWrapper>
  );
};

export default HomeSectionTabs;

const TabsWrapper = styled.div`
  width: 100%;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const TabsBar = styled.div`
  position: relative;
  display: flex;
  width: 115px;
  flex: 0 0 auto;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  background: transparent;
  border: none;
  width: fit-content;
  padding: 6px 5px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  color: #6b6b6b;
  position: relative;
  transition: color 0.2s;
  ${({ $active }) =>
    $active &&
    css`
      color: #f44336;
      font-weight: 700;
    `}
`;

const Indicator = styled.span<{ $index: number }>`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 50%;
  background: #f44336;
  border-radius: 10px;
  transform: translateX(${(p) => p.$index * 100}%);
  transition: transform 0.25s ease;
`;

const TabPanel = styled.div`
  padding-top: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding-bottom: 16px;
`;

const EmptyText = styled.div`
  padding: 24px 4px;
  font-size: 13px;
  color: #888;
  text-align: center;
`;
