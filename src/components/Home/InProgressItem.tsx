import styled, { css } from "styled-components";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoCalendarClearOutline } from "react-icons/io5";
import clockLoaderIcon from "../../assets/icons/clock_loader_icon.svg";
import creditCardIcon from "../../assets/icons/credit_card_icon.svg";
import groupsIcon from "../../assets/icons/groups_icon.svg";
import exitIcon from "../../assets/icons/exit_icon.svg";

export type StatusType = "정산진행중" | "입금 필요" | "관리 필요" | "종료";

interface InProgressItemProps {
  title: string;
  dueDate: string;
  status: StatusType;
  settlementId: string;
  role: "OWNER" | "MEMBER";
}

const InProgressItem: React.FC<InProgressItemProps> = ({
  title,
  dueDate,
  status,
  settlementId,
  role,
}) => {
  const navigate = useNavigate();
  const isDone = status === "종료";
  const handleClick = useCallback(() => {
    if (status === "정산진행중") {
      navigate(
        `/reviewReceipt?settlementId=${encodeURIComponent(settlementId)}`
      );
      return;
    }
    if (role === "OWNER") {
      navigate(
        `/result/manager?settlementId=${encodeURIComponent(settlementId)}`
      );
    } else {
      navigate(
        `/result/member?settlementId=${encodeURIComponent(settlementId)}`
      );
    }
  }, [navigate, role, settlementId, status]);
  return (
    <Card $done={isDone} onClick={handleClick} role="button" tabIndex={0}>
      <TopRow>{title}</TopRow>
      <BottomRow>
        <DueDateBox>
          <CalendarIcon />
          {dueDate}
        </DueDateBox>
        <StatusBadge $status={status} $done={isDone}>
          <StatusIcon
            src={
              status === "정산진행중"
                ? clockLoaderIcon
                : status === "입금 필요"
                ? creditCardIcon
                : status === "관리 필요"
                ? groupsIcon
                : exitIcon
            }
            alt={status}
          />
          {status}
        </StatusBadge>
      </BottomRow>
    </Card>
  );
};

export default InProgressItem;

const Card = styled.div<{ $done?: boolean }>`
  border: 0.5px solid #d9d9d9;
  border-radius: 5px;
  padding: 10px 12px 12px 15px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: ${({ $done }) => ($done ? "#f0f0f0" : "#ffffff")};
  color: ${({ $done }) => ($done ? "#000" : "inherit")};
  cursor: pointer;
`;

const TopRow = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #000;
  line-height: 1.3;
  word-break: break-word;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DueDateBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #6b6b6b;
  padding: 0 8px 0 6px;
  height: 15px;
  border-radius: 2px;
  gap: 4px;
  background: #fff;
  font-size: 8px;
  font-weight: 600;
  color: #000;
`;

const CalendarIcon = styled(IoCalendarClearOutline)`
  font-size: 10px;
`;

const StatusBadge = styled.span<{ $status: StatusType; $done?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px 0 4px;
  height: 15px;
  font-size: 8px;
  font-weight: 700;
  border-radius: 2px;
  color: ${({ $done }) => ($done ? "#000" : "#fff")};
  ${({ $status, $done }) =>
    $done
      ? css`
          background: #e0e0e0;
          border: 1px solid #cfcfcf;
        `
      : $status === "정산진행중"
      ? css`
          background: #00d337;
          border: 1px solid #00d337;
        `
      : css`
          background: #f44336;
          border: 1px solid #f44336;
        `};
  gap: 3px;
`;

const StatusIcon = styled.img`
  width: 9px;
  height: 9px;
  object-fit: contain;
`;
