import styled from "styled-components";
import backIcon from "../../assets/icons/back_icon.svg";

type BackIconButtonProps = {
  onClick?: () => void;
  ariaLabel?: string;
  inHeader?: boolean;
};

const BackIconButton = ({
  onClick,
  ariaLabel = "이전 페이지로 이동",
  inHeader = false,
}: BackIconButtonProps) => {
  return (
    <Button type="button" onClick={onClick} aria-label={ariaLabel} $inHeader={inHeader}>
      <img src={backIcon} alt="" />
    </Button>
  );
};

export default BackIconButton;

const Button = styled.button<{ $inHeader: boolean }>`
  position: absolute;
  left: 20px;
  top: ${({ $inHeader }) => ($inHeader ? "50%" : "28px")};
  transform: ${({ $inHeader }) => ($inHeader ? "translateY(-50%)" : "none")};
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 14px;
    height: 14px;
  }
`;
