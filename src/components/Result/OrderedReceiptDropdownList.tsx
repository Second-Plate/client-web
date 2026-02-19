import { useMemo } from "react";
import ReceiptDropdown from "../common/ReceiptDropdown";
import type { DataType } from "../../types/receipt";

type OrderedReceiptDropdownListProps = {
  entries: DataType[];
  nickname: string;
  settlementId: number;
};

const OrderedReceiptDropdownList = ({
  entries,
  nickname,
  settlementId,
}: OrderedReceiptDropdownListProps) => {
  const orderedEntries = useMemo(() => {
    const mine = entries.find((entry) => entry.user === nickname);
    const total = entries.find((entry) => /전체/.test(entry.user));
    const others = entries.filter((entry) => entry !== mine && entry !== total);

    return [mine, total, ...others].filter(
      (entry): entry is DataType => Boolean(entry)
    );
  }, [entries, nickname]);

  return (
    <>
      {orderedEntries.map((entry) => (
        <ReceiptDropdown
          key={entry.user}
          initialPaid={entry.paid}
          settlementId={settlementId}
          data={{
            user: entry.user,
            userId: entry.user_id,
            items: entry.items,
          }}
        />
      ))}
    </>
  );
};

export default OrderedReceiptDropdownList;
