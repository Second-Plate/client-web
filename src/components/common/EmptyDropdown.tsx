import styled from "styled-components";

const EmptyDropdown = () => {
  return (
    <EmptyDropdownLayout>
      <DropdownCard>
        <CardLeft>
          <span>불참한 사용자</span>
        </CardLeft>
      </DropdownCard>
    </EmptyDropdownLayout>
  );
};

export default EmptyDropdown;

const EmptyDropdownLayout = styled.div`
  padding-bottom: 10px;
`;
const DropdownCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 320px;
  height: 38px;
  border-radius: 5px;
  background: #d9d9d9;
  padding: 0 12px 0 16px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
