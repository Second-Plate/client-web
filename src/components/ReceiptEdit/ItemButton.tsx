import React from 'react';
import styled from "styled-components";
import { IoChevronForwardOutline } from "react-icons/io5";

interface ItemButtonProps {
    title?: string;
    count?: string;
    price?: string;
    onClick?: () => void;
}

const ItemButton: React.FC<ItemButtonProps> = ({ 
    title = "품목명을 입력해 주세요", 
    count = "1",
    price = "10",
    onClick 
}) => {
    return (
        <ItemContainer onClick={onClick}>
            <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDetails>
                    <ItemCount>{count} 개</ItemCount>
                    <ItemPrice>{price} 원</ItemPrice>
                </ItemDetails>
            </ItemContent>
            <ChevronIcon>
                <IoChevronForwardOutline />
            </ChevronIcon>
        </ItemContainer>
    );
};

export default ItemButton;

const ItemContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 16px 40px 16px 16px;
    border-radius: 5px;
    border: 0.5px solid #D9D9D9;
    background: #FFF;
    cursor: pointer;
    transition: all 0.2s ease;
    box-sizing: border-box;

    &:hover {
        background-color: #f8f9fa;
        border-color: #d0d7de;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }
`;

const ItemContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
    padding-right: 8px;
`;

const ItemTitle = styled.div`
    color: #000;
    font-family: "NanumSquare", sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 800;
    line-height: 130%; /* 15.6px */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ItemDetails = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
`;

const ItemCount = styled.div`
    color: #000;
    font-family: "NanumSquare", sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 130%; /* 15.6px */
`;

const ItemPrice = styled.div`
    color: #000;
    font-family: "NanumSquare", sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 130%; /* 15.6px */
`;

const ChevronIcon = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999999;
    font-size: 18px;
    flex-shrink: 0;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    
    svg {
        transition: transform 0.2s ease;
    }

    ${ItemContainer}:hover & svg {
        transform: translateX(2px);
    }
`;