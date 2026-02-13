import React, { useState } from "react";
import styled from "styled-components";

export interface TopContentProps {
  title: string;
  date?: string;
  onDateChange?: (date: string) => void;
  onTitleChange?: (title: string) => void;
  onBackClick?: () => void;
  placeholder?: string;
  showBackButton?: boolean;
}

const TopContent: React.FC<TopContentProps> = ({
  title,
  date = "",
  onDateChange,
  onTitleChange,
  onBackClick,
  placeholder = "YYYY-MM-DD",
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [tempDate, setTempDate] = useState(date);

  // 제목이 바뀌면 tempTitle도 동기화
  React.useEffect(() => {
    if (!isEditingTitle) setTempTitle(title);
  }, [title, isEditingTitle]);

  // 날짜가 바뀌면 tempDate도 동기화
  React.useEffect(() => {
    if (!isEditingDate) setTempDate(date);
  }, [date, isEditingDate]);

  // 제목 편집 모드 활성화 (편집 중이면 재진입 불가)
  const handleTitleContainerClick = () => {
    if (!isEditingTitle) {
      setIsEditingTitle(true);
      setTempTitle(title);
    }
  };

  // 날짜 편집 모드 활성화 (편집 중이면 재진입 불가)
  const handleDateContainerClick = () => {
    if (!isEditingDate) {
      setIsEditingDate(true);
      setTempDate(date);
    }
  };

  // 제목 저장
  const handleTitleSave = () => {
    if (onTitleChange && tempTitle.trim()) {
      onTitleChange(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  // 날짜 저장
  const handleDateSave = () => {
    if (onDateChange && tempDate) {
      onDateChange(tempDate);
    }
    setIsEditingDate(false);
  };

  // 키보드 이벤트 처리
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setTempTitle(title);
      setIsEditingTitle(false);
    }
  };

  const handleDateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDateSave();
    } else if (e.key === "Escape") {
      setTempDate(date);
      setIsEditingDate(false);
    }
  };

  // 외부 클릭으로 편집 모드 종료
  const handleTitleBlur = () => {
    handleTitleSave();
  };

  const handleDateBlur = () => {
    handleDateSave();
  };

  // 20자 제한 (표시할 때는 항상 prop으로 받은 title을 사용)
  const displayTitle = title.length > 20 ? title.slice(0, 20) + "..." : title; // 20자 넘으면 '...' 추가

  return (
    <TopContentContainer>
      <TopNavContainer>
        <BackButton onClick={onBackClick}>
          <img src="/src/assets/icons/back_icon.svg" alt="Back" />
        </BackButton>

        {/* TitleContainer의 스타일 변경 */}
        <TitleContainer onClick={handleTitleContainerClick}>
          {isEditingTitle ? (
            <TitleInput
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              maxLength={50}
            />
          ) : (
            <TitleWrapper> {/* TitleWrapper 추가 */}
              <Title title={title}>
                {displayTitle}
              </Title>
              <EditButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleTitleContainerClick();
                }}
              >
                <img src="/src/assets/icons/edit_icon.svg" alt="Edit" />
              </EditButton>
            </TitleWrapper>
          )}
        </TitleContainer>

        <PlaceholderDiv />
      </TopNavContainer>

      <DateNavContainer>
        <DateContainer onClick={handleDateContainerClick}>
          {isEditingDate ? (
            <DateInput
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              onBlur={handleDateBlur}
              onKeyDown={handleDateKeyDown}
              autoFocus
            />
          ) : (
            <>
              <DateRow>
                <DateText>{date || placeholder}</DateText>
              </DateRow>
              <CalendarButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDateContainerClick();
                }}
              >
                <img src="/src/assets/icons/calendar_icon.svg" alt="Calendar" />
              </CalendarButton>
            </>
          )}
        </DateContainer>
      </DateNavContainer>

      <Divider />
    </TopContentContainer>
  );
};

export default TopContent;

const TopContentContainer = styled.div`
  width: 100%;
  flex-shrink: 0;
`;

const TopNavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-shrink: 0;
  margin-top: 45px;
  position: relative;
  height: 30px;
  gap: 8px; /* BackButton, TitleContainer, PlaceholderDiv 사이 간격 */
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  flex-shrink: 0; /* 내용이 길어져도 줄어들지 않도록 */

  &:hover {
    opacity: 0.7;
  }
`;

const PlaceholderDiv = styled.div`
  min-width: 40px; /* BackButton과 동일한 최소 너비 */
  flex-shrink: 0; /* 내용이 길어져도 줄어들지 않도록 */
`;

const DateNavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  position: relative;
  height: 40px;
  padding-right: 16px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; /* 전체 Wrapper를 중앙 정렬 */
  flex-grow: 1; /* 남은 공간을 채우도록 */
  cursor: pointer;
  padding: 4px; /* 내부 패딩 */
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 0; /* flex 아이템이 내용물보다 작아질 수 있도록 */

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  min-width: 0; /* TitleWrapper도 내용물보다 작아질 수 있도록 */
  max-width: 100%; /* 부모 TitleContainer의 너비를 넘지 않도록 */
`;

const Title = styled.h1`
  flex-grow: 1; /* 남은 공간 채우기 */
  min-width: 0; /* 내용이 길어도 줄어들 수 있도록 */
  color: #000;
  text-align: left; /* 텍스트를 왼쪽 정렬 */
  font-family: "NanumSquare", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
  margin: 0;
  white-space: nowrap; /* 텍스트를 한 줄에 표시 */
  overflow-x: scroll; /* 가로 스크롤 허용 */
  overflow-y: hidden;
  text-overflow: clip; /* ... 처리 대신 클립 */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* 파이어폭스 스크롤바 숨김 */
  padding-right: 4px; /* EditButton과의 간격 */


  &::-webkit-scrollbar {
    display: none; /* 웹킷 브라우저 스크롤바 숨김 */
  }
`;

const EditButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding-left: 4px;
  flex-shrink: 0; /* 줄어들지 않도록 */
  img {
    width: 12px;
    height: 12px;
  }
  &:hover {
    opacity: 0.7;
  }
`;

const TitleInput = styled.input`
  color: #000;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
  margin: 0;
  padding: 4px 8px; /* 패딩 조정 */
  border: 2px solid #007bff;
  border-radius: 6px;
  background-color: #fff;
  outline: none;
  width: 100%; /* 부모의 100%를 차지하도록 */
  max-width: 300px; /* 최대 너비 설정 */

  &:focus {
    border-color: #0056b3;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

// 날짜 표시 영역
const DateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 12px;
  border-radius: 8px;
`;

const DateText = styled.div`
  color: #000;
  text-align: right;
  font-family: "NanumSquare", sans-serif;
  font-size: 13px;
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
  white-space: nowrap;
`;

const CalendarButton = styled.div`
  margin-left: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    width: 12px;
    height: 12px;
  }
  &:hover {
    opacity: 0.7;
  }
`;

const DateInput = styled.input`
  color: #000;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: 13px;
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
  margin: 0;
  padding: 4px 8px;
  border: 2px solid #007bff;
  border-radius: 6px;
  background-color: #fff;
  outline: none;
  width: 140px;

  &:focus {
    border-color: #0056b3;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

// 구분선
const Divider = styled.hr`
  border: none;
  border-bottom: 2px solid #222;
  margin: 0;
`;