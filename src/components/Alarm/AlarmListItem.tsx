import styled from "styled-components";
import { ALARM_TYPE_ICON } from "../../constants/status";

interface AlarmListItemProps {
  alarmText: string;
  read: boolean;
  type: string;
}

const AlarmListItem: React.FC<AlarmListItemProps> = ({
  alarmText,
  read,
  type,
}) => {
  const iconSrc = read
    ? "/src/assets/icons/read_icon.svg"
    : ALARM_TYPE_ICON[type];
  return (
    <Item $read={read}>
      <StatusBadge>
        <IconImg src={iconSrc} alt={read ? "read" : type} />
      </StatusBadge>
      <AlarmText>{alarmText}</AlarmText>
    </Item>
  );
};

export default AlarmListItem;

const Item = styled.div<{ $read: boolean }>`
  display: flex;
  align-items: center;
  padding: 6px 10px 6px;
  margin-bottom: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  gap: 3px;
  background: ${({ $read }) => ($read ? "#eeeeee" : "#ffffff")};
`;

const AlarmText = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
`;

const StatusBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin-right: 6px;
`;

const IconImg = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;
