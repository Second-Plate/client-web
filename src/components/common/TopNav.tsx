import React from "react";
import styled from "styled-components";

export interface TopNavProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ 
  title, 
  showBackButton = false, 
  onBackClick 
}) => {
  return (
    <TopNavContainer>
      {showBackButton ? (
        <BackButton onClick={onBackClick}>
          <img src="src/assets/icons/back_icon.svg" alt="Back" />
        </BackButton>
      ) : (
        <Spacer />
      )}
      <Title>{title}</Title>
      <Spacer /> {/* 오른쪽 공간을 위한 빈 공간 */}
    </TopNavContainer>
  );
};

export default TopNav;

const TopNavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  margin-top: 45px;
  margin-bottom: 10px;
  position: relative;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  min-width: 40px; /* 최소 너비 보장 */
  
  &:hover {
    opacity: 0.7;
  }
`;

const Spacer = styled.div`
  min-width: 40px; /* BackButton과 동일한 최소 너비 */
`;

const Title = styled.h1`
  position: absolute; 
  left: 50%; 
  transform: translateX(-50%);
  
  color: #000;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: clamp(14px, 4vw, 20px); /* 동적 폰트 크기 */
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
  margin: 0;
  white-space: nowrap;
  max-width: calc(100% - 160px); /* 좌우 버튼 영역 확보 (80px씩) */
  overflow: hidden;
  text-overflow: ellipsis; /* 너무 길면 ... 표시 */
`;