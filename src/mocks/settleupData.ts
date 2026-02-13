import { type UserSelection } from "../components/ReviewReceipt/SettleupDrawer";

export interface ItemData {
  status: string;
  name: string;
  quantity: number;
  price: number;
  selections: UserSelection[];
}

export const settleupData: ItemData[] = [
  {
    status: "완료",
    name: "콜라",
    quantity: 4,
    price: 1500,
    selections: [
      { user: "이채영", amount: 1 },
      { user: "사용자1", amount: 1 },
      { user: "사용자2", amount: 2 },
    ],
  },
  {
    status: "미완료",
    name: "사이다",
    quantity: 3,
    price: 1500,
    selections: [
      { user: "사용자1", amount: 1 },
      { user: "사용자3", amount: 1 },
    ],
  },
  {
    status: "초과",
    name: "양상추",
    quantity: 2,
    price: 1680,
    selections: [
      { user: "이채영", amount: 1 },
      { user: "사용자1", amount: 1 },
      { user: "사용자2", amount: 1 },
      { user: "사용자3", amount: 1 },
    ],
  },
];
