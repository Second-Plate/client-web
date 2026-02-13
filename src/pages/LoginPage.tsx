import React from 'react';
import styled from 'styled-components';
import LoginImg from '../assets/images/login_img.svg';
import GoogleIcon from '../assets/icons/google_icon.svg';

const LoginPage = () => {

    const handleLoginClick = () => {
        // 구글 로그인 로직 구현
        alert('구글 로그인 기능이 아직 구현되지 않았습니다.');
    };

    return (
        <LoginLayout>
            <ImageContainer>
                <img src={LoginImg} alt="정산 시작 이미지" />
            </ImageContainer>
            <ButtonContainer>
                <ActionButton onClick={handleLoginClick}>
                <GoogleIconImage src={GoogleIcon} alt="구글 아이콘" />
                <ButtonText>구글 계정으로 계속하기</ButtonText>
                </ActionButton>
            </ButtonContainer>
        </LoginLayout>
    );
};

export default LoginPage;

const LoginLayout = styled.div`
  background-color: #F44336;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  flex: 1;
  
  img {
    max-width: 100%;
    height: auto;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 352px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 70px;
`;

const ActionButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #fffffff;
  color: #F44336;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: #cfb1aeff;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const GoogleIconImage = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const ButtonText = styled.span`
  color: #F44336;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
`;