import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopContent from "./TopContent";
import ItemButton from "./ItemButton";
import ItemAddButton from "./ItemAddButton";
import ItemEditNav from "./ItemEditNav";
import BottomNav from "../common/BottomNav";
import receiptData from "../../data/receiptData.json";
import type { ReceiptData as OCRReceiptData } from "../../apis/ocrApi";
import type { ReceiptItem } from "../../types/receipt";

type ReceiptEditState = {
  receiptData?: OCRReceiptData;
  editedReceipt?: {
    title: string;
    date: string;
    items: ReceiptItem[];
  };
};

type EditableItem = ReceiptItem & {
  id: number;
};

const parseNumber = (value: string): number => {
  const parsed = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const ReceiptEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as ReceiptEditState;

  const initialReceipt = useMemo(() => {
    const ocrReceipt = state.receiptData;
    if (!ocrReceipt) return receiptData;

    const mappedItems: ReceiptItem[] = (ocrReceipt.items || []).map((item) => ({
      name: item.name,
      quantity: item.count,
      price: item.totalPrice || item.unitPrice,
    }));

    return {
      title: ocrReceipt.storeName || receiptData.title,
      date: ocrReceipt.date || receiptData.date,
      items: mappedItems.length > 0 ? mappedItems : receiptData.items,
    };
  }, [state.receiptData]);

  const [title, setTitle] = useState(initialReceipt.title);
  const [date, setDate] = useState(initialReceipt.date);
  const [items, setItems] = useState<EditableItem[]>(
    initialReceipt.items.map((item, index) => ({
      id: index + 1,
      ...item,
    }))
  );
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const editingItem = items.find((item) => item.id === editingItemId) ?? null;

  const updateEditingItem = (partial: Partial<Omit<EditableItem, "id">>) => {
    if (editingItemId === null) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === editingItemId ? { ...item, ...partial } : item
      )
    );
  };

  const handleAddItem = () => {
    const newItem: EditableItem = {
      id: Date.now(),
      name: "",
      quantity: 1,
      price: 0,
    };
    setItems((prev) => [...prev, newItem]);
    setEditingItemId(newItem.id);
  };

  const handleNextClick = () => {
    const currentParams = new URLSearchParams(location.search);
    const nextParams = new URLSearchParams();
    const settlementId = currentParams.get("settlementId");
    if (settlementId && !Number.isNaN(Number(settlementId))) {
      nextParams.set("settlementId", settlementId);
    }
    const queryString = nextParams.toString();

    const nextState: ReceiptEditState = {
      ...state,
      editedReceipt: {
        title,
        date,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    navigate(`/selectpeoplecount${queryString ? `?${queryString}` : ""}`, {
      state: nextState,
    });
  };

  return (
    <PageLayout>
      <TopContent
        title={title}
        date={date}
        onTitleChange={setTitle}
        onDateChange={setDate}
        onBackClick={() => navigate(-1)}
      />

      <ContentSection>
        <ItemList>
          {items.map((item) => (
            <ItemButton
              key={item.id}
              title={item.name || "품목명을 입력해 주세요"}
              count={String(item.quantity)}
              price={item.price.toLocaleString()}
              onClick={() => setEditingItemId(item.id)}
            />
          ))}
        </ItemList>

        <AddButtonWrapper>
          <ItemAddButton onClick={handleAddItem} />
        </AddButtonWrapper>
      </ContentSection>

      <BottomNav
        description="수정한 영수증을 확인하고 다음 단계로 이동해 주세요."
        primaryLabel="다음"
        onPrimaryClick={handleNextClick}
      />

      {editingItem && (
        <ItemEditNav
          title={editingItem.name}
          count={String(editingItem.quantity)}
          price={editingItem.price.toLocaleString()}
          onTitleChange={(next) => updateEditingItem({ name: next })}
          onCountChange={(next) =>
            updateEditingItem({ quantity: Math.max(parseNumber(next), 1) })
          }
          onPriceChange={(next) =>
            updateEditingItem({ price: Math.max(parseNumber(next), 0) })
          }
          onClose={() => setEditingItemId(null)}
          onSave={() => setEditingItemId(null)}
        />
      )}
    </PageLayout>
  );
};

export default ReceiptEdit;

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
`;

const ContentSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px 120px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AddButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;
