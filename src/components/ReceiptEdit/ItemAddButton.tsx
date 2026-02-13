import React from 'react';
import styled from "styled-components";

interface ItemAddButtonProps {
    onClick?: () => void;
}

const ItemAddButton: React.FC<ItemAddButtonProps> = ({ onClick }) => {
    const handleAddItem = () => {
        if (onClick) {
            onClick();
        } else {
            console.log('새 항목 추가');
        }
    };
    
    return (
        <ItemAddButtonContainer onClick={handleAddItem}>
            <img src="/src/assets/images/item_add_button.svg" alt="Add" />
        </ItemAddButtonContainer>
    );
};

export default ItemAddButton;

const ItemAddButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        border-color: #ff4444;
        color: #ff4444;
        background-color: #fff5f5;
    }
`;