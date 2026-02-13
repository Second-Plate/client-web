import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import hourglassIcon from '../assets/icons/hourglass-icon.svg';
import OCRLoading from '../components/OCRLoading/OCRLoading';
import type { OCRResult, ReceiptData, OCRApiInterface } from '../apis/ocrApi';
import { ocrApi } from '../apis/ocrApi';

const OCRLoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const createDefaultData = (): ReceiptData => {
    return {
      storeName: '상점명 없음',
      date: new Date().toLocaleDateString('ko-KR'),
      items: [
        {
          name: '상품 정보 없음',
          count: 1,
          unitPrice: 0,
          totalPrice: 0,
        }
      ],
      totalAmount: 0,
    };
  };

  useEffect(() => {
    // /startsettlement에서 전달받은 이미지 파일 확인
    const state = location.state as { imageFile?: File };
    if (state?.imageFile) {
      setImageFile(state.imageFile);
    } else {
      // 이미지 파일이 없으면 startsettlement 페이지로 리다이렉트
      navigate('/startsettlement');
    }
  }, [location, navigate]);

  const handleSuccess = (result: OCRResult) => {
    try {
      const parsedData = (ocrApi as OCRApiInterface).parseReceiptData(result);
      
      // receiptconfirm 페이지로 데이터와 함께 이동
      navigate('/receiptconfirm', {
        state: {
          receiptData: parsedData,
          originalImage: imageFile
        }
      });
    } catch (error) {
      console.error('영수증 데이터 파싱 실패, 기본 데이터 사용:', error);
      
      const defaultData = createDefaultData();
      
      // 기본 데이터로 receiptconfirm 페이지로 이동
      navigate('/receiptconfirm', {
        state: {
          receiptData: defaultData,
          originalImage: imageFile
        }
      });
    }
  };

  const handleError = (error: string) => {
    console.error('OCR 처리 실패:', error);
    
    // 에러 발생 시에도 기본 데이터로 receiptconfirm 페이지로 이동
    const defaultData = createDefaultData();
    
    navigate('/receiptconfirm', {
      state: {
        receiptData: defaultData,
        originalImage: imageFile,
        ocrError: true,
        errorMessage: 'OCR 처리에 실패하여 기본 데이터를 사용합니다.'
      }
    });
  };

  // 이미지 파일이 없으면 아무것도 렌더링하지 않음
  if (!imageFile) {
    return null;
  }

  return (
    <OCRLoadingPageLayout>
      <LoadingImage src={hourglassIcon} alt="로딩 중" />
      <OCRLoading
        imageFile={imageFile}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </OCRLoadingPageLayout>
  );
};

export default OCRLoadingPage;

const OCRLoadingPageLayout = styled.div`
  background-color: #F44336;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
`;

const LoadingImage = styled.img`
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  margin-bottom: 50px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;