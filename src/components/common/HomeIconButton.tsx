import styled from "styled-components";
import { IoHomeOutline } from "react-icons/io5";

type HomeIconButtonProps = {
  onClick?: () => void;
  ariaLabel?: string;
};

const HomeIconButton = ({
  onClick,
  ariaLabel = "홈으로 이동",
}: HomeIconButtonProps) => {
  return (
    <Button type="button" onClick={onClick} aria-label={ariaLabel}>
      <IoHomeOutline />
    </Button>
  );
};

export default HomeIconButton;

const Button = styled.button`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  padding: 4px;
  color: #6b6b6b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;
