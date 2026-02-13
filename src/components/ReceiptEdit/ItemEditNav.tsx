import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import styled from "styled-components";

type ItemEditNavProps = {
  title?: string;
  count?: string;
  price?: string;
  onTitleChange?: (title: string) => void;
  onCountChange?: (count: string) => void;
  onPriceChange?: (price: string) => void;
  onSave?: () => void;
  onClose?: () => void;
};

type EditableFieldType = 'title' | 'count' | 'price';

interface EditableFieldConfig {
  type: EditableFieldType;
  label: string;
  value: string;
  unit?: string;
  inputType: 'text' | 'number';
  placeholder?: string;
  min?: string;
  maxLength?: number;
  onClick: () => void;
  onSave?: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: () => void;
  onChange: (value: string) => void;
  isEditing: boolean;
  tempValue: string;
}

const ItemEditNav: React.FC<ItemEditNavProps> = ({
  title = "",
  count = "2",
  price = "8,000",
  onTitleChange,
  onCountChange,
  onPriceChange,
  onSave,
  onClose,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState<number>(0);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  
  // 편집 상태 관리
  const [editingField, setEditingField] = useState<EditableFieldType | null>(null);
  
  // 임시 값 관리
  const [tempTitle, setTempTitle] = useState(title);
  const [tempCount, setTempCount] = useState(count);
  const [tempPrice, setTempPrice] = useState(price);

  // 키보드 감지를 위한 viewport 높이 추적
  useEffect(() => {
    const initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    
    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDiff = initialViewportHeight - currentHeight;
      
      if (heightDiff > 150) {
        setKeyboardHeight(heightDiff);
        setIsKeyboardOpen(true);
      } else {
        setKeyboardHeight(0);
        setIsKeyboardOpen(false);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    } else {
      window.addEventListener('resize', handleViewportChange);
      return () => {
        window.removeEventListener('resize', handleViewportChange);
      };
    }
  }, []);

  useLayoutEffect(() => {
    if (barRef.current) {
      setSpacerHeight(barRef.current.offsetHeight);
    }
  }, [isKeyboardOpen, keyboardHeight]);

  // 공통 편집 함수들
  const handleFieldClick = (field: EditableFieldType) => {
    setEditingField(field);
    switch (field) {
      case 'title':
        setTempTitle(title);
        break;
      case 'count':
        setTempCount(count);
        break;
      case 'price':
        setTempPrice(price);
        break;
    }
  };

  const handleFieldSave = (field: EditableFieldType) => {
    let value = '';
    let callback: ((value: string) => void) | undefined;

    switch (field) {
      case 'title':
        value = tempTitle.trim();
        callback = onTitleChange;
        break;
      case 'count':
        value = tempCount.trim();
        callback = onCountChange;
        break;
      case 'price':
        value = tempPrice.trim();
        callback = onPriceChange;
        break;
    }

    if (callback && value) {
      callback(value);
    }
    setEditingField(null);
  };

  const handleFieldKeyDown = (e: React.KeyboardEvent, field: EditableFieldType) => {
    if (e.key === 'Enter') {
      handleFieldSave(field);
    } else if (e.key === 'Escape') {
      // 원래 값으로 복원
      switch (field) {
        case 'title':
          setTempTitle(title);
          break;
        case 'count':
          setTempCount(count);
          break;
        case 'price':
          setTempPrice(price);
          break;
      }
      setEditingField(null);
    }
  };

  const handleFieldBlur = (field: EditableFieldType) => {
    handleFieldSave(field);
  };

  // EditableField 렌더링 컴포넌트
  const EditableField: React.FC<{ config: EditableFieldConfig }> = ({ config }) => {
    const {
      type,
      label,
      value,
      unit,
      inputType,
      placeholder,
      min,
      maxLength,
      onClick,
      // onSave, // <-- 이 줄을 삭제하거나 주석 처리합니다.
      onKeyDown,
      onBlur,
      onChange,
      isEditing,
      tempValue
    } = config;
    
    // 제목 필드는 특별한 스타일 적용
    if (type === 'title') {
      return (
        <ItemTitleSection onClick={onClick}>
          {isEditing ? (
            <ItemTitleInput
              type="text"
              value={tempValue}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              autoFocus
              maxLength={maxLength}
            />
          ) : (
            <TitleRow>
              <TitleText>
                {value || placeholder}
                <EditIcon onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}>
                  <img src="/src/assets/icons/edit_icon.svg" alt="Edit" />
                </EditIcon>
              </TitleText>
            </TitleRow>
          )}
        </ItemTitleSection>
      );
    }

    // 일반 필드 (수량, 가격)
    return (
      <DetailRow onClick={onClick}>
        <DetailLabel>{label}</DetailLabel>
        {isEditing ? (
          <DetailInput
            type={inputType}
            value={tempValue}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            autoFocus
            min={min}
            placeholder={placeholder}
          />
        ) : (
          <DetailValueContainer>
            <DetailValue>{value} {unit}</DetailValue>
            <Chevron>〉</Chevron>
          </DetailValueContainer>
        )}
      </DetailRow>
    );
  };

  // 필드 설정 배열
  const fieldConfigs: EditableFieldConfig[] = [
    {
      type: 'title',
      label: '제목',
      value: title,
      inputType: 'text',
      placeholder: "품목명을 입력해 주세요",
      maxLength: 50,
      onClick: () => handleFieldClick('title'),
      onSave: () => handleFieldSave('title'),
      onKeyDown: (e) => handleFieldKeyDown(e, 'title'),
      onBlur: () => handleFieldBlur('title'),
      onChange: setTempTitle,
      isEditing: editingField === 'title',
      tempValue: tempTitle
    },
    {
      type: 'count',
      label: '수량',
      value: count,
      unit: '개',
      inputType: 'number',
      min: '1',
      onClick: () => handleFieldClick('count'),
      onSave: () => handleFieldSave('count'),
      onKeyDown: (e) => handleFieldKeyDown(e, 'count'),
      onBlur: () => handleFieldBlur('count'),
      onChange: setTempCount,
      isEditing: editingField === 'count',
      tempValue: tempCount
    },
    {
      type: 'price',
      label: '가격',
      value: price,
      unit: '원',
      inputType: 'text',
      placeholder: '0',
      onClick: () => handleFieldClick('price'),
      onSave: () => handleFieldSave('price'),
      onKeyDown: (e) => handleFieldKeyDown(e, 'price'),
      onBlur: () => handleFieldBlur('price'),
      onChange: setTempPrice,
      isEditing: editingField === 'price',
      tempValue: tempPrice
    }
  ];

  return (
    <>
      <Spacer style={{ height: spacerHeight }} />
      <BarWrapper 
        ref={barRef} 
        $isKeyboardOpen={isKeyboardOpen}
        $keyboardHeight={keyboardHeight}
      >
        <CloseButton onClick={onClose}>
          <img src="src\assets\icons\cancel_icon.svg" alt="Close" />
        </CloseButton>
        
        {fieldConfigs.map((config) => (
          <EditableField key={config.type} config={config} />
        ))}

        <SaveButton onClick={() => { if (onSave) onSave(); }}>저장하기</SaveButton>
      </BarWrapper>
    </>
  );
};

export default ItemEditNav;

const Spacer = styled.div`
  /* 동적 높이를 위한 스페이서 */
`;

const BarWrapper = styled.div<{ $isKeyboardOpen: boolean; $keyboardHeight: number }>`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 350px;
  background: #ffffff;
  box-shadow: 2px -2px 15px rgba(0, 0, 0, 0.1);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
  
  bottom: ${props => props.$isKeyboardOpen ? `${Math.max(props.$keyboardHeight - 100, 0)}px` : '0'};
  transition: bottom 0.3s ease-out;
  
  @supports (-webkit-appearance: none) {
    ${props => props.$isKeyboardOpen && `
      position: absolute;
      bottom: auto;
      top: calc(100vh - ${props.$keyboardHeight + 200}px);
    `}
  }
  
  @media (max-height: 667px) {
    ${props => props.$isKeyboardOpen && `
      bottom: ${Math.max(props.$keyboardHeight - 120, 10)}px;
    `}
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    opacity: 0.7;
  }
`;

const ItemTitleSection = styled.div`
  margin-top: 12px;
  cursor: pointer;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 2px solid #333;
`;

const TitleText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-family: "NanumSquare", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0;
  white-space: nowrap;
  
  overflow-x: auto;
  overflow-y: hidden;
  text-overflow: clip;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none; 
  }
`;

const EditIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding-left: 4px;
  
  img {
    width: 12px;
    height: 12px;
  }
  
  &:hover {
    opacity: 0.7;
  }
`;

const ItemTitleInput = styled.input`
  width: 100%;
  padding: 0 0 12px 0;
  border: none;
  border-bottom: 2px solid #333;
  background: transparent;
  font-family: "NanumSquare", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  outline: none;
  
  &::placeholder {
    color: #999;
    font-weight: 400;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const DetailLabel = styled.span`
  font-family: "NanumSquare", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #333;
`;

const DetailValueContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailValue = styled.div`
  font-family: "NanumSquare", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #333;
`;

const Chevron = styled.span`
  color: #999;
  font-size: 14px;
  font-weight: 300;
`;

const DetailInput = styled.input`
  padding: 4px 8px;
  border: 2px solid #007bff;
  border-radius: 6px;
  background-color: #fff;
  outline: none;
  font-family: "NanumSquare", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  text-align: right;
  min-width: 70px;
  
  &:focus {
    border-color: #0056b3;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  height: 40px;
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: "NanumSquare", sans-serif;
  font-weight: 800;
  font-size: 16px;
  line-height: 130%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #c0392b;
  }
  
  &:active {
    background-color: #a93226;
  }
`;