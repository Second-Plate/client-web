import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import pizzaImg from "../../assets/images/pizza_modal_img.svg";
import cancelIcon from "../../assets/icons/cancel_icon.svg";
import { useProfileStore } from "../../stores/profileStore";

interface LinkShareModalProps {
  open: boolean;
  code?: string;
  url: string;
  onClose?: () => void;
}

const LinkShareModal: React.FC<LinkShareModalProps> = ({
  open,
  code,
  url,
  onClose,
}) => {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const { profile } = useProfileStore();

  const copyShareCode = async () => {
    if (!url) return;
    try {
      const message = `복잡한 정산, 걱정을 피자! ${profile.nickname}님이 정산방을 생성하셨어요. 링크를 눌러 참여해 주세요.\n\n${url}\n`;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
      } else {
        const ta = document.createElement("textarea");
        ta.value = message;
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  useEffect(() => {
    let el = document.getElementById("modal-root") as HTMLElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = "modal-root";
      document.body.appendChild(el);
    }
    setPortalEl(el);
  }, []);

  if (!open || !portalEl) return null;

  return createPortal(
    <>
      <Backdrop onClick={onClose} />
      <ModalWrapper
        role="dialog"
        aria-modal="true"
        aria-label="링크 공유 안내"
        onClick={onClose}
      >
        <ModalInner onClick={(e) => e.stopPropagation()}>
          <CloseButton type="button" aria-label="닫기" onClick={onClose}>
            <img src={cancelIcon} alt="" />
          </CloseButton>
          <ImageWrapper>
            <PizzaImg src={pizzaImg} alt="피자 아이콘" />
          </ImageWrapper>
          <TextWrapper>
            <Title>친구에게 링크를 공유해 주세요!</Title>
            <InfoText>클릭 시 참여코드가 복사됩니다.</InfoText>
            <CodeTag
              role="button"
              tabIndex={0}
              aria-label="참여 코드 복사"
              onClick={copyShareCode}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  copyShareCode();
                }
              }}
            >
              참여 코드: {code}
            </CodeTag>
          </TextWrapper>
        </ModalInner>
      </ModalWrapper>
    </>,
    portalEl
  );
};

export default LinkShareModal;

// Animations
// translate 는 Wrapper 에서만 적용하고, 내부 애니메이션에서는 scale/opacity 만 다뤄 수평 점프 방지
const popIn = keyframes`
  from { transform: scale(.94); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1200;
`;

const ModalWrapper = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1201;
  width: 265px;
  height: 186px;
`;

const ModalInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 16px 20px; /* 상단 이미지 자리 확보 */
  box-sizing: border-box;
  animation: ${popIn} 0.28s ease;
  will-change: transform, opacity;
  overflow: visible;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 11px;
  height: 11px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: -25%;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  display: flex;
  justify-content: center;
`;

const PizzaImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  margin-top: 18px;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 800;
  text-align: center;
  line-height: 1.3;
  color: #000;
  margin-bottom: 6px;
  margin: 0;
`;

const InfoText = styled.p`
  font-size: 10px;
  color: #6b6b6b;
  font-weight: 500;
  margin: 6px 0 6px 0;
`;
const CodeTag = styled.div`
  width: fit-content;
  background: #f44336;
  color: #fff;
  font-size: 13px;
  font-weight: 400;
  padding: 6px 8px;
  border-radius: 30px;
  line-height: 1;
  text-align: center;
  cursor: pointer;
`;
