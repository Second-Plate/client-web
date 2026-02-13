import styled from "styled-components";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectCountImg from "../../assets/images/select_count_img.svg";
import MinusButtonIcon from "../../assets/icons/minus_button_icon.svg";
import PlusButtonIcon from "../../assets/icons/plus_button_icon.svg";
import BottomNav from "../../components/common/BottomNav";

const SelectPeopleCount = () => {
  const navigate = useNavigate();
  
    const handleNextClick = () => {
      // 다음 페이지로 이동하는 로직
      console.log("다음 클릭");
    };

  const [peopleCount, setPeopleCount] = useState(2);

  const handleIncrement = () => {
  if (peopleCount < 8) {
    setPeopleCount(prev => prev + 1);
  }
};

const handleDecrement = () => {
  if (peopleCount > 2) {
    setPeopleCount(prev => prev - 1);
  }
};
  return (
    <SelectPeopleCountLayout>
        <Title>정산 인원을 선택해 주세요.</Title>
        <CounterContainer>
        <PizzaContainer>
          <PizzaWrapper>
            {Array.from({ length: 8 }, (_, index) => {
             const baseAngle = index * 45 - 90; // -90도로 12시 방향부터 시작
              const isFlipped = index % 2 === 1; // 홀수 인덱스는 좌우반전
              // 좌우반전된 조각들은 각도를 조정해서 원형을 맞춤
              const angle = isFlipped ? baseAngle + 45 : baseAngle;
              const isVisible = index < peopleCount;

              return (
                <PizzaSlice
                  key={index}
                  angle={angle}
                  isVisible={isVisible}
                  animationDelay={index * 0.1}
                  $isFlipped={isFlipped}
                >
                  <img src={SelectCountImg} alt={`피자 조각 ${index + 1}`} />
                </PizzaSlice>
              );
            })}
          </PizzaWrapper>

          <MinusButton 
            onClick={handleDecrement}
            disabled={peopleCount <= 2}
          >
            <img src={MinusButtonIcon} alt="-버튼" />
          </MinusButton>

          <PlusButton  
            onClick={handleIncrement}
            disabled={peopleCount >= 8}
          >
            <img src={PlusButtonIcon} alt="+버튼" />
          </PlusButton>
        </PizzaContainer>

          <CountDisplay>
            <CountNumber>{peopleCount} 명</CountNumber>
          </CountDisplay>
        </CounterContainer>

      <BottomNav 
        description="나를 포함해서 최소 2명, 최대 8명까지 참여 가능해요."
        primaryLabel="다음"
        onPrimaryClick={handleNextClick}
      />

    </SelectPeopleCountLayout>
  );
};

export default SelectPeopleCount;

const SelectPeopleCountLayout = styled.div`
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #000;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
  margin-bottom: 80px;
`;

const CounterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PizzaContainer = styled.div`
  margin-left: 50px;
  margin-bottom: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PizzaWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PizzaSlice = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 12px 87px; /* 피자 조각의 뾰족한 끝부분을 기준으로 회전 */
  transform: translate(-50%, -50%) rotate(${props => props.angle}deg) ${props => props.$isFlipped ? 'scaleX(-1)' : ''};
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
  transition-delay: ${props => props.isVisible ? props.animationDelay + 's' : '0s'};
  
  svg {
    width: 74px;
    height: 87px;
    display: block;
    transform: translate(-12px, -87px); /* 회전 기준점을 중앙으로 이동 */
  }
`;

const MinusButton = styled.button`
  position: absolute;
  left: -80px;
  top: 70%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: none;
  border: none;
   border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;

  &:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.1);
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:focus {
    outline: none; /* 포커스 시에도 테두리 제거 */
  }
`;

const PlusButton = styled.button`
  position: absolute;
  right: -30px;
  top: 70%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: none;
  border: none;
   border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;

  &:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.1);
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:focus {
    outline: none; /* 포커스 시에도 테두리 제거 */
  }
`;

const CountDisplay = styled.div`
  text-align: center;
  margin-bottom: 100px;
`;

const CountNumber = styled.span`
  color: #F44336;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: 17px;
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
`;