import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ocrApi, type OCRResult, type OCRApiInterface } from '../../apis/ocrApi';

interface OCRLoadingProps {
  imageFile: File;
  onSuccess: (result: OCRResult) => void;
  onError: (error: string) => void;
}

const OCRLoading: React.FC<OCRLoadingProps> = ({
  imageFile,
  onSuccess,
  onError,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const processOCR = async () => {
      try {
        // 파일 유효성 검사
        const validation = (ocrApi as OCRApiInterface).validateImageFile(imageFile);
        if (!validation.isValid) {
          console.warn('파일 유효성 검사 실패:', validation.error);
          onError(validation.error || '파일 유효성 검사에 실패했습니다.');
          return;
        }

        // 진행률 시뮬레이션
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 15;
          });
        }, 500);

        // OCR 처리 시작
        const result = await (ocrApi as OCRApiInterface).processReceiptImage(imageFile);
        
        // 처리 완료
        clearInterval(progressInterval);
        setProgress(100);
        
        // 성공 콜백 호출
        setTimeout(() => {
          onSuccess(result);
        }, 500);

      } catch (error) {
        console.error('OCR 처리 중 오류 발생:', error);
        setProgress(0);
        
        // 에러 콜백 호출
        const errorMessage = error instanceof Error ? error.message : 'OCR 처리 중 오류가 발생했습니다.';
        onError(errorMessage);
      }
    };

    processOCR();

    // 컴포넌트 언마운트 시 정리
    return () => {
      setProgress(0);
    };
  }, [imageFile, onSuccess, onError]);

  return (
    <LoadingContainer>
      <Title>영수증을 추출하고 있어요...</Title>
      <LoadingBar>
        <LoadingProgress progress={progress} />
        <LoadingShine />
      </LoadingBar>
    </LoadingContainer>
  );
};

export default OCRLoading;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-family: "NanumSquare", sans-serif;
  font-weight: 800;
  font-size: 20px;
  line-height: 130%;
  text-align: center;
  color: #FFFFFF;
  margin-top: 0;
  margin-bottom: 20px;
`;

const LoadingBar = styled.div`
  width: 173px;
  height: 7px; 
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3.5px; 
  flex-shrink: 0;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
`;

const LoadingProgress = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #FFF;
  border-radius: 3.5px;
  width: ${props => props.progress}%;
  transition: width 0.3s ease-out;
`;

const LoadingShine = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: loading 2s infinite;
  
  @keyframes loading {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;