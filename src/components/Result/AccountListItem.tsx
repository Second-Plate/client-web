import React from "react";
import styled from "styled-components";
import { BiCopy } from "react-icons/bi";

interface AccountListItemProps {
  bank: string;
  accountNumber: string;
  owner: string;
  className?: string;
  onCopy?: (fullText: string) => void;
}

const AccountListItem: React.FC<AccountListItemProps> = ({
  bank,
  accountNumber,
  owner,
  className,
  onCopy,
}) => {
  const fullCopyText = `${bank} ${accountNumber} (${owner})`;

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullCopyText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = fullCopyText;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      onCopy?.(fullCopyText);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  return (
    <Wrapper className={className}>
      <TextBlock>
        <Line>{bank}</Line>
        <Line style={{ marginTop: 4 }}>
          {accountNumber} ({owner})
        </Line>
      </TextBlock>
      <IconButton
        type="button"
        aria-label={`계좌 정보 복사: ${fullCopyText}`}
        onClick={copyToClipboard}
      >
        <BiCopy size={18} color="#555" />
      </IconButton>
    </Wrapper>
  );
};

export default AccountListItem;

const Wrapper = styled.div`
  width: 100%;
  background: #fff;
  border: 0.5px solid #d9d9d9;
  border-radius: 5px;
  padding: 10px 16px 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 12px;
  font-weight: 800;
  gap: 12px;
  margin-bottom: 10px;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.15;
  flex: 1;
  overflow: hidden;
`;

const Line = styled.span`
  color: #000;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.2px;
  word-break: break-all;
`;

const IconButton = styled(BiCopy)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: #6b6b6b;
`;
