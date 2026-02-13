import styled from "styled-components";
import rightIcon from "../assets/icons/right_icon.svg";
import { useNavigate } from "react-router-dom";
import AlarmListItem from "../components/Alarm/AlarmListItem.tsx";
import AlarmData from "../mocks/alarmData.json";
import { getAlarmList } from "../apis/homeApi.ts";
import type { AlarmDataType } from "../types/receipt.ts";
import { useState, useEffect } from "react";
import { useProfileStore } from "../stores/profileStore.ts";
const AlarmPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const [alarmData, setAlarmData] = useState<AlarmDataType[]>([
    ...(AlarmData as AlarmDataType[]),
  ]);

  useEffect(() => {
    const fetchAlarmData = async () => {
      const data = await getAlarmList(profile.userId);
      setAlarmData(data);
    };

    fetchAlarmData();
  }, []);
  return (
    <PageWrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <BackIcon src={rightIcon} alt="뒤로가기" />
        </BackButton>
        <Title>알림</Title>
        <HeaderRight />
      </Header>
      <ListWrapper>
        {alarmData.map((it) => (
          <AlarmListItem
            key={it.id}
            alarmText={it.message}
            read={it.read}
            type={it.type}
          />
        ))}
      </ListWrapper>
    </PageWrapper>
  );
};

export default AlarmPage;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 10px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  z-index: 10;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 22px;
  height: 22px;
  transform: scaleX(-1);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const HeaderRight = styled.div`
  width: 22px;
  height: 22px;
`;

const ListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 14px 20px;
  background: #fafafa;
  margin-top: 10px;
`;
