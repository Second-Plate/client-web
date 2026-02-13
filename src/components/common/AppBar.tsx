import styled from "styled-components";
import logoImg from "../../assets/images/logo_img.svg";
import alarmIcon from "../../assets/icons/bell_icon.svg";
import mypageIcon from "../../assets/images/mypage_icon.svg";
import { useNavigate } from "react-router-dom";

const AppBar = () => {
  const navigate = useNavigate();
  return (
    <BarWrapper>
      <Left>
        <IconImage src={logoImg} alt="profile" />
      </Left>
      <Right>
        <IconButton aria-label="alarm" onClick={() => navigate(`/alarm`)}>
          <SmallIcon src={alarmIcon} alt="alarm" />
        </IconButton>
        <IconButton aria-label="mypage" onClick={() => navigate(`/mypage`)}>
          <SmallIcon src={mypageIcon} alt="mypage" />
        </IconButton>
      </Right>
    </BarWrapper>
  );
};

export default AppBar;

const BarWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 22px;
  width: 100%;
  box-sizing: border-box;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconImage = styled.img`
  width: 60px;
  object-fit: cover;
`;

const SmallIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
`;
