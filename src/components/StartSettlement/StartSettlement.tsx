import styled from "styled-components";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StartSettlementImage from "../../assets/images/start_settlement_img.svg";
import { type OCRResult } from "../../apis/ocrApi";

const StartSettlement = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OCR 로딩 상태 관리
  const [isOCRLoading, setIsOCRLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleLoadReceiptClick = () => {
    fileInputRef.current?.click();
  };

  const handleDReceiptEditClick = () => {
    navigate('/receiptedit');
  };

  const handleInvitationCodeClick = () => {
    navigate('/invitationcode');
  };


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.');
        return;
      }
      
      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      
      console.log("선택된 파일:", file);
      
      // OCR 로딩 시작
      setSelectedFile(file);
      setIsOCRLoading(true);
    }
  };

  const handleOCRSuccess = (result: OCRResult) => {
    console.log('OCR 성공:', result);
    setIsOCRLoading(false);
    setSelectedFile(null);
    
    // OCR 결과와 함께 다음 페이지로 이동
    // 결과 데이터를 state로 전달하거나 context/store에 저장
    navigate('/receiptconfirm', { 
      state: { 
        ocrResult: result,
        imageFile: selectedFile 
      } 
    });
  };

  const handleOCRError = (error: string) => {
    console.error('OCR 실패:', error);
    setIsOCRLoading(false);
    setSelectedFile(null);
    
    // 에러 알림
    alert(`영수증 인식에 실패했습니다: ${error}`);
  };

  // OCR 로딩 중이면 로딩 화면 표시
  if (isOCRLoading && selectedFile) {
    navigate('/ocrloading', 
      { state: { imageFile: selectedFile } })
  }

  return (
    <StartSettlementLayout>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }} 
        aria-label="영수증 이미지 선택"
      />

      <TopSection>
        <Title>새로운 정산을 시작해볼까요?</Title>
        <Subtitle>정산할 품목을 어떤 방식으로 가져올지 정해주세요.</Subtitle>
        <ImageContainer>
          <img src={StartSettlementImage} alt="정산 시작 이미지" />
        </ImageContainer>
      </TopSection>
      <ButtonContainer>
        <ActionButton onClick={handleLoadReceiptClick}>
          <ButtonText>영수증 불러오기</ButtonText>
        </ActionButton>
        <ActionButton onClick={handleDReceiptEditClick}>
          <ButtonText>직접 작성하기</ButtonText>
        </ActionButton>
      </ButtonContainer>
      <ParticipationCode onClick={handleInvitationCodeClick} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') handleInvitationCodeClick(); }}>
        <CodeText>참여코드를 갖고 계신가요?</CodeText>
      </ParticipationCode>
    </StartSettlementLayout>
  );
};

export default StartSettlement;

const StartSettlementLayout = styled.div`
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const TopSection = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Title = styled.h1`
  color: #000;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  color: #000;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  margin: 0; /* 기본 마진 제거 */
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 70px;
  margin-bottom: 160px;
  
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
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const ActionButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #F44336;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #c0392b;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ButtonText = styled.span`
  color: #FFF;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
`;

const ParticipationCode = styled.div`
  cursor: pointer;
  padding: 10px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CodeText = styled.span`
  color: #6B6B6B;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  text-decoration: underline;
`;