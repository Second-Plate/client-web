import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Layout = () => {
  return (
    <LayoutWrapper>
      <Main>
        <Outlet />
      </Main>
    </LayoutWrapper>
  );
};

export default Layout;

const LayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh; /* dynamic viewport height for mobile browser UI */
  width: 100vw;
  background-color: #fffafa;
`;
const Main = styled.div`
  width: 390px;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* allow inner pages to manage their own scroll */
`;
