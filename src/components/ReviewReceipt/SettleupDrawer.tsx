import { FaRegCheckCircle } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useProfileStore } from "../../stores/profileStore";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import SelectionAdjuster from "./SelectionAdjuster";
import { BsXLg } from "react-icons/bs";

import userIcon from "../../assets/icons/user_icon.svg";

export interface UserSelection {
  user: string;
  amount: number;
}

export interface SettleupDrawerProps {
  open: boolean;
  name: string;
  quantity: number;
  price: number;
  selections: UserSelection[];
  onClose: () => void;
  onSave?: (newAmount: number) => void;
}

const SettleupDrawer: React.FC<SettleupDrawerProps> = ({
  open,
  name,
  quantity,
  price,
  selections,
  onClose,
  onSave,
}) => {
  const { profile } = useProfileStore();
  const [portalEl, setPortalEl] = React.useState<HTMLElement | null>(null);
  const mySelection = selections.find((s) => s.user === profile.nickname);
  const [tempValue, setTempValue] = useState<number>(
    () => mySelection?.amount ?? 0
  );
  const [savedMark, setSavedMark] = useState(false);
  const [attemptedSave, setAttemptedSave] = useState(false);
  const myAmount = selections
    .filter((s) => s.user === profile.nickname)
    .reduce<number>((a, c) => a + c.amount, 0);
  const othersSum = selections
    .filter((s) => s.user !== profile.nickname)
    .reduce<number>((a, c) => a + c.amount, 0);
  const totalIfSaved = othersSum + tempValue;
  const exceeds = totalIfSaved > quantity;

  const handleTempChange = (v: number) => {
    setTempValue(v);
  };

  const commitSave = () => {
    setAttemptedSave(true);
    if (exceeds) return; // 초과면 경고 표시 후 저장/닫기 중단
    if (onSave) onSave(tempValue);
    setSavedMark(true);
    setTimeout(() => {
      setSavedMark(false);
      onClose();
    }, 2000); // 2초간 체크 아이콘 노출
  };

  const commitCancel = () => {
    setTempValue(myAmount);
    onClose();
  };
  useEffect(() => {
    if (open) {
      const latest =
        selections.find((s) => s.user === profile.nickname)?.amount ?? 0;
      setTempValue(latest);
      setAttemptedSave(false);
      setSavedMark(false);
    }
  }, [open, selections]);

  useEffect(() => {
    let el = document.getElementById(
      "drawer-portal-root"
    ) as HTMLElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = "drawer-portal-root";
      document.body.appendChild(el);
    }
    setPortalEl(el);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!portalEl) return null;

  return createPortal(
    <>
      {open && <TransparentOverlay aria-hidden onClick={onClose} />}
      <DrawerContainer
        role="dialog"
        aria-modal="true"
        aria-label={`${name} 정산 상세`}
        open={open}
        onClick={onClose}
      >
        <Inner onClick={(e) => e.stopPropagation()}>
          <HeaderRow>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Title>{name}</Title>
              <QuantityTag>{quantity}개</QuantityTag>
            </div>
            <HeaderActions>
              {savedMark ? (
                <FaRegCheckCircle
                  color="#00d337"
                  size={36}
                  style={{ display: "block", marginRight: 2 }}
                  aria-label="저장 완료"
                />
              ) : (
                <SaveButton
                  type="button"
                  onClick={commitSave}
                  disabled={savedMark}
                >
                  저장
                </SaveButton>
              )}
              <HeaderButton type="button" onClick={commitCancel} />
            </HeaderActions>
          </HeaderRow>
          <PriceP>{price.toLocaleString()}원</PriceP>
          {attemptedSave && exceeds && (
            <ExceedWarn role="alert">
              ❗수량을 확인해 주세요. (입력 초과)
            </ExceedWarn>
          )}
          <List>
            {selections
              .filter((sel) => sel.user !== profile.nickname)
              .map((sel) => {
                const formatted = Number.isInteger(sel.amount)
                  ? sel.amount.toString()
                  : sel.amount.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
                return (
                  <ListItem key={sel.user}>
                    <img alt="유저아이콘" src={userIcon} />
                    <UserName>{sel.user}</UserName>
                    <AmountTag>{formatted}개</AmountTag>
                  </ListItem>
                );
              })}
          </List>
          <AdjusterWrapper>
            <SelectionAdjuster
              assignedValue={myAmount}
              max={quantity}
              onChange={handleTempChange}
            />
          </AdjusterWrapper>
        </Inner>
      </DrawerContainer>
    </>,
    portalEl
  );
};

export default SettleupDrawer;

// Styles
const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const DrawerContainer = styled.div<{ open: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: ${({ open }) =>
    open ? "2px -2px 15px rgba(0, 0, 0, 0.1)" : "none"};
  transform: translateY(${({ open }) => (open ? "0%" : "100%")});
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${({ open }) => (open ? slideUp : "none")} 0.35s;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  box-sizing: border-box;
  height: 260px;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 14px;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: fit-content;
  gap: 6px;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
`;

const QuantityTag = styled.div`
  width: fit-content;
  padding: 0 5px;
  font-size: 9px;
  font-weight: 500;
  color: #fff;
  background-color: black;
  border-radius: 20px;
`;

const PriceP = styled.p`
  font-size: 18px;
  font-weight: 800;
  line-height: 130%;
`;

const ExceedWarn = styled.div`
  width: 90%;
  color: #f44336;
  font-size: 11px;
  font-weight: 800;
  background-color: #ffffd0;
  padding: 6px 10px;
  margin-bottom: 6px;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
  font-size: 12px;
`;

const UserName = styled.span`
  font-weight: 600;
`;

const AmountTag = styled.p`
  font-size: 8px;
  background-color: #fdd9d7;
  color: #f44336;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
`;

const AdjusterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  padding-bottom: 4px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SaveButton = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  padding: 2px 4px;
`;
const HeaderButton = styled(BsXLg)`
  all: unset;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  color: #000;
  padding: 2px 4px;
`;

const TransparentOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 1000;
`;
