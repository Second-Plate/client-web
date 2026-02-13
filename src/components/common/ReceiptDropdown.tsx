import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useLocation } from "react-router-dom";
import arrowIcon from "../../assets/icons/keyboard_arrow_down.svg";
import { useReceiptOpenStore } from "../../stores/useReceiptOpenStore";
import {
  postChangeDepositState,
  postUrge,
  postChangeDepositStateManager,
} from "../../apis/reviewReceiptApi";
import { useProfileStore } from "../../stores/profileStore";
import type { ReceiptData } from "../../types/receipt";

interface ReceiptDropdownProps {
  data: ReceiptData;
  initialPaid?: boolean;
  onStatusChange?: (paid: boolean) => void;
}

const ReceiptDropdown: React.FC<ReceiptDropdownProps> = ({
  data,
  initialPaid = false,
  onStatusChange,
}) => {
  const settlementId = 0;
  const { profile } = useProfileStore();
  const { openUser, setOpenUser } = useReceiptOpenStore();
  const open = openUser === data.user;
  const location = useLocation();
  const isManagerPage = location.pathname === "/result/manager";
  const isMemberPage = location.pathname === "/result/member";

  const mine = data.user === profile.nickname;
  const isTotal = /전체/.test(data.user);
  const [isPaid, setIsPaid] = useState<boolean>(initialPaid);

  const totalQuantity = data.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPrice = data.items.reduce((sum, item) => sum + item.price, 0);
  const togglePaid = async () => {
    console.log("togglePaid 클릭", isPaid);
    setIsPaid((prev) => {
      const next = !prev;
      onStatusChange?.(next);
      return next;
    });
    await postChangeDepositState(settlementId, data.userId);
  };

  const submitUrge = async () => {
    await postUrge(data.userId); //
  };
  const showStatusDot = isManagerPage && !mine && !isTotal;
  const statusDotColor = isPaid ? "#07A320" : "#f44336";

  type ActionBtn = { label: string; color: string; onClick: () => void };
  let actionButtons: ActionBtn[] = [];

  // Manager: 다른 사람 & 전체 아님
  if (!isTotal && isManagerPage && !mine) {
    if (!isPaid) {
      actionButtons = [
        {
          label: "입금 요청하기",
          color: "#f44336",
          onClick: () => {
            submitUrge();
          },
        },
        {
          label: "입금 완료하기",
          color: "#00D337",
          onClick: async () => {
            setIsPaid(true);
            onStatusChange?.(true);
            await postChangeDepositStateManager(settlementId, data.userId);
          },
        },
      ];
    } else {
      actionButtons = [
        {
          label: "입금 취소하기",
          color: "#f44336",
          onClick: async () => {
            setIsPaid(false);
            onStatusChange?.(false);
            await postChangeDepositStateManager(settlementId, data.userId);
          },
        },
      ];
    }
    // 역할이 참여자인 경우
  } else if (!isTotal && isMemberPage && mine) {
    actionButtons = [
      {
        label: isPaid ? "입금 취소하기" : "입금 완료하기",
        color: isPaid ? "#f44336" : "#00D337",
        onClick: () => togglePaid(),
      },
    ];
  }

  return (
    <ReceiptDropdownLayout>
      <DropdownCard
        onClick={() => setOpenUser(open ? null : data.user)}
        isOpen={open}
      >
        <CardLeft>
          <span>{mine ? "내 영수증 📌" : data.user}</span>
          {showStatusDot && <StatusDot aria-hidden $color={statusDotColor} />}
        </CardLeft>
        <CardRight>
          {!open && (
            <TotalPriceText>{totalPrice.toLocaleString()}원</TotalPriceText>
          )}
          <ArrowImg aria-hidden $open={open} src={arrowIcon} alt="" />
        </CardRight>
      </DropdownCard>
      {open && (
        <DropdownContent role="region" aria-label={`${data.user} 영수증 상세`}>
          <table>
            <thead>
              <tr>
                <th>품목명</th>
                <th>수량</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity} 개</td>
                  <td>{item.price.toLocaleString()} 원</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ fontWeight: 700, textAlign: "left" }}>총합</td>
                <td style={{ fontWeight: 700 }}>{totalQuantity} 개</td>
                <td style={{ fontWeight: 700 }}>
                  {totalPrice.toLocaleString()}원
                </td>
              </tr>
            </tfoot>
          </table>
          {actionButtons.length === 1 && (
            <ActionButton
              type="button"
              style={{ background: actionButtons[0].color }}
              onClick={actionButtons[0].onClick}
            >
              {actionButtons[0].label}
            </ActionButton>
          )}
          {actionButtons.length === 2 && (
            <ButtonsRow>
              {actionButtons.map((b) => (
                <RowButton
                  key={b.label}
                  type="button"
                  style={{ background: b.color }}
                  onClick={b.onClick}
                >
                  {b.label}
                </RowButton>
              ))}
            </ButtonsRow>
          )}
        </DropdownContent>
      )}
    </ReceiptDropdownLayout>
  );
};

export default ReceiptDropdown;

const ReceiptDropdownLayout = styled.div`
  padding-bottom: 10px;
`;
const DropdownCard = styled.div<{ isOpen: boolean }>`
  width: 320px;
  height: 38px;
  border-radius: ${({ isOpen }) => (isOpen ? "5px 5px 0 0" : "5px")};
  background: #fff;
  border: ${({ isOpen }) => (isOpen ? "" : "0.5px solid #d9d9d9")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 16px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CardRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TotalPriceText = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #000;
`;

const ArrowImg = styled.img<{ $open: boolean }>`
  width: 18px;
  height: 18px;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 0.22s ease;
  opacity: 0.75;
`;

const slideDown = keyframes`
  from { transform: translateY(-4px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const DropdownContent = styled.div`
  width: 320px;
  background: #fff;
  border: 0 1px 1px 1px solid #eee;
  border-radius: 0 0 5px 5px;
  padding: 6px 14px 12px 14px;
  animation: ${slideDown} 0.28s ease;
  transform-origin: top center;
  will-change: transform, opacity;
  table {
    width: 100%;
    border-collapse: collapse;
    border-top: 2px solid black;
    background-color: white;
    table-layout: fixed;
    font-size: 10px;
    font-weight: 500;

    thead,
    tr {
      background-color: #fff;
    }

    th,
    td {
      border-bottom: 1px solid #e0e0e0;
      padding: 4px 8px;
      background: #fff;
      text-align: center;
    }
    th:nth-child(1),
    td:nth-child(1),
    th:nth-child(2),
    td:nth-child(2),
    th:nth-child(3),
    td:nth-child(3) {
      text-align: left;
    }
    th:nth-child(1),
    td:nth-child(1) {
      width: 50%;
    }
    th:nth-child(2),
    td:nth-child(2),
    th:nth-child(3),
    td:nth-child(3) {
      width: 25%;
    }
    th {
      background: #fff;
      font-weight: 700;
      font-size: 10px;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    tfoot td {
      border-bottom: none;
      background: #fff;
    }
    tfoot tr:first-child td {
      border-top: 1px solid white;
      position: relative;
      padding-top: 10px;
    }
    tfoot tr:first-child td::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 1px;
      background: repeating-linear-gradient(
        to right,
        #000 0 5px,
        transparent 5px 10px
      );
      pointer-events: none;
    }
  }
`;

const StatusDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const ActionButton = styled.button`
  width: 100%;
  height: 40px;
  margin-top: 16px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonsRow = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  margin-top: 16px;
`;

const RowButton = styled.button`
  flex: 1 1 0;
  height: 40px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
