import styled from "styled-components";
import AppBar from "../components/common/AppBar";
import { useNavigate } from "react-router-dom";
import HomeSectionTabs from "../components/Home/HomeSectionTabs";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <HomePageLayout>
      <AppBar />
      <BodyContent>
        <NewSettlementWrapper>
          <Title>새 정산을 시작할까요?</Title>
          <Subtitle>친구들과 간편하게 정산을 진행해 보세요</Subtitle>
          <StartButton onClick={() => navigate("/startsettlement")}>
            정산 시작하기
          </StartButton>
        </NewSettlementWrapper>
        <TabsContainer>
          <HomeSectionTabs />
        </TabsContainer>
      </BodyContent>
    </HomePageLayout>
  );
};

export default HomePage;

const HomePageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh; /* ensure full viewport height for internal scrolling */
`;

const BodyContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 0 20px;
  flex-direction: column;
  flex: 1; /* take remaining space below AppBar */
  overflow: hidden; /* allow inner container to manage its own scroll */
`;

const NewSettlementWrapper = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f44336;
  border-radius: 12px;
  padding: 18px 0px;
  margin-top: 30px;
`;

const TabsContainer = styled.div`
  width: 100%;
  flex: 1; /* occupy remaining space below the banner */
  display: flex; /* allow child to stretch */
  min-height: 0; /* critical for flex children to be scrollable */
`;

const Title = styled.h1`
  margin: 0 0 10px 0;
  font-size: 19px;
  color: #ffffff;
  font-weight: 800;
`;

const Subtitle = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  color: #ffffff;
  font-weight: 700;
`;

const StartButton = styled.button`
  background: #ffffff;
  color: #f44336;
  font-size: 15px;
  font-weight: 800;
  width: 90%;
  padding: 10px 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  &:active {
    transform: translateY(1px);
  }
`;
