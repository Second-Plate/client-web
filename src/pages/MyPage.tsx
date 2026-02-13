import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../stores/profileStore";
import userIcon from "../assets/icons/user_icon.svg";
import rightIcon from "../assets/icons/right_icon.svg";

const MyPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfileStore();

  return (
    <MypageLayout>
      <TopBar>
        <RightCluster>
          <UserIcon src={userIcon} alt="user" />
          <Nickname>{profile.nickname}님</Nickname>
        </RightCluster>
      </TopBar>
      <BackRow>
        <BackButton type="button" onClick={() => navigate("/home")}>
          <BackIcon src={rightIcon} alt="뒤로가기" />
        </BackButton>
      </BackRow>

      <Divider />

      {/* 계정 섹션 */}
      <SectionTitle>계정</SectionTitle>
      <List>
        <SettingItem role="button" tabIndex={0}>
          <ItemLabel>닉네임 변경</ItemLabel>
          <ArrowIcon src={rightIcon} alt="자세히" />
        </SettingItem>
        <SettingItem role="button" tabIndex={0}>
          <ItemLabel>이메일 변경</ItemLabel>
          <ArrowIcon src={rightIcon} alt="자세히" />
        </SettingItem>
        <SettingItem role="button" tabIndex={0}>
          <ItemLabel>휴대폰 번호 변경</ItemLabel>
          <ArrowIcon src={rightIcon} alt="자세히" />
        </SettingItem>
      </List>

      <Divider />

      {/* 계좌번호 섹션 */}
      <SectionTitle>계좌번호</SectionTitle>
      <List>
        <SettingItem role="button" tabIndex={0}>
          <ItemLabel>내 계좌 관리</ItemLabel>
          <ArrowIcon src={rightIcon} alt="자세히" />
        </SettingItem>
      </List>

      <Divider />

      {/* 알림 섹션 */}
      <SectionTitle>알림</SectionTitle>
      <List>
        <PlainItem>PUSH 알림</PlainItem>
        <PlainItem>알림톡</PlainItem>
        <PlainItem>진행중인 정산 리마인드</PlainItem>
      </List>
    </MypageLayout>
  );
};

export default MyPage;

const MypageLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 16px 20px 24px;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  position: relative;
  height: 40px;
`;

const RightCluster = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const UserIcon = styled.img`
  width: 25px;
  height: 25px;
`;

const Nickname = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #000;
`;

const BackRow = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 0 10px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  padding: 6px 0;
  font-size: 12px;
  font-weight: 700;
  color: #000;
  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 17px;
  height: 17px;
  transform: rotate(180deg);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: black;
  margin: 10px 0;
`;

const SectionTitle = styled.p`
  font-size: 13px;
  color: #6b6b6b;
  font-weight: 700;
  margin: 6px 0 8px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  cursor: pointer;
`;

const ItemLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #000;
`;

const ArrowIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const PlainItem = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #000;
  padding: 12px 0;
`;
