import { useEffect } from "react";
import styled from "styled-components";

interface FloatingAlertProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number; 
}

const FloatingAlert = ({
  message,
  show,
  onClose,
  duration = 3000,
}: FloatingAlertProps) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show) return null;
  return <AlertWrapper>{message}</AlertWrapper>;
};

export default FloatingAlert;

const AlertWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #d8eede;
  color: #000;
  font-size: 12px;
  padding: 10px 24px;
  border-radius: 100px;
  width: 60%;
  text-align: center;
  animation: fadeSlide 0.3s ease-out;
  @keyframes fadeSlide {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;
