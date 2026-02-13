import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReceiptEditPage from "../pages/ReceiptEditPage";
import InvitationCodePage from "../pages/InvitationCodePage";
import StartSettlementPage from "../pages/StartSettlementPage";
import ReviewReceiptPage from "../pages/ReviewReceiptPage";
import ResultMemberPage from "../pages/ResultMemberPage";
import ResultManagerPage from "../pages/ResultManagerPage";
import FinishSettleupPage from "../pages/FinishSettleupPage";
import HomePage from "../pages/HomePage";
import AlarmPage from "../pages/AlarmPage";
import ReceiptConfirmPage from "../pages/ReceiptConfirmPage";
import MyPage from "../pages/MyPage";
import OCRLoadingPage from "../pages/OCRLoadingPage";
import LoginPage from "../pages/LoginPage";
import SelectPeopleCountPage from "../pages/SelectPeopleCountPage";
import Layout from "../components/Layout/Layout";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/alarm" element={<AlarmPage />} />
          <Route path="/invitationcode" element={<InvitationCodePage />} />
          <Route path="/startsettlement" element={<StartSettlementPage />} />
          <Route path="/result/manager" element={<ResultManagerPage />} />
          <Route path="/result/member" element={<ResultMemberPage />} />
          <Route path="/review" element={<ReviewReceiptPage />} />
          <Route path="/finish" element={<FinishSettleupPage />} />
          <Route path="/receiptconfirm" element={<ReceiptConfirmPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/ocrloading" element={<OCRLoadingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/selectpeoplecount" element={<SelectPeopleCountPage />} />
          <Route path="/receiptedit" element={<ReceiptEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
