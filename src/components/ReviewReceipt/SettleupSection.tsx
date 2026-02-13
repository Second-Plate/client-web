import { useState } from "react";
import styled from "styled-components";
import SettleupItem from "./SettleupItem";
import { settleupData, type ItemData } from "../../mocks/settleupData";

const SettleupSection = () => {
  const MYNAME = "내이름";
  const [items, setItems] = useState<ItemData[]>(() => settleupData);

  const handleUpdateMyAmount = (itemName: string, newAmount: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.name === itemName
          ? {
              ...it,
              selections: it.selections.map((sel) =>
                sel.user === MYNAME ? { ...sel, amount: newAmount } : sel
              ),
            }
          : it
      )
    );
  };

  return (
    <SettleupSectionLayout>
      {items.map((item) => (
        <SettleupItem
          key={item.name}
          {...item}
          onUpdateMyAmount={(amt) => handleUpdateMyAmount(item.name, amt)}
        />
      ))}
    </SettleupSectionLayout>
  );
};

export default SettleupSection;

const SettleupSectionLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: #eeeeee;
  width: auto;
  height: 100vh;
  margin-top: 24px;
  padding: 24px 20px 0 20px;
`;
