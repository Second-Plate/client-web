import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

interface SelectionAdjusterProps {
  assignedValue: number; // 외부에서 내가 할당한 값
  max: number; // quantity 한도
  onChange: (value: number) => void;
}

const SelectionAdjuster: React.FC<SelectionAdjusterProps> = ({
  assignedValue,
  max,
  onChange,
}) => {
  const [value, setValue] = useState<number>(assignedValue);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) setValue(assignedValue);
  }, [assignedValue, editing]);

  const clamp = (v: number) => {
    if (Number.isNaN(v) || v < 0) return 0;
    if (v > max) v = max;
    return Math.trunc(v); // 정수 강제
  };

  const stepChange = (delta: number) => {
    setValue((prev) => {
      const next = prev + delta;
      const finalVal = clamp(next);
      onChange(finalVal);
      return finalVal;
    });
  };

  const handleDirectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (Number.isNaN(raw)) return setValue(0);
    setValue(clamp(raw));
  };

  const commit = () => {
    const v = clamp(value);
    setValue(v);
    onChange(v);
    setEditing(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") {
  setValue(assignedValue);
      setEditing(false);
    }
  };

  return (
    <Wrapper>
      <ControlRow>
        <SideButton
          type="button"
          aria-label="decrease"
          onClick={() => stepChange(-1)}
        >
          -
        </SideButton>
        <ValueArea onClick={() => !editing && setEditing(true)}>
          {editing ? (
            <ValueInput
              ref={inputRef}
              value={value}
              onChange={handleDirectChange}
              onKeyDown={onKey}
              onBlur={commit}
              step={1}
              min={0}
              max={max}
              type="number"
            />
          ) : (
            <ValueText>{value}</ValueText>
          )}
        </ValueArea>
        <SideButton
          type="button"
          aria-label="increase"
          onClick={() => stepChange(1)}
        >
          +
        </SideButton>
      </ControlRow>
    </Wrapper>
  );
};

export default SelectionAdjuster;

const Wrapper = styled.div`
  width: 350px;
  height: 40px;
  background: #d9d9d9;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 4px 8px 6px;
  box-sizing: border-box;
  gap: 2px;
`;

const ControlRow = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SideButton = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  font-weight: 600;
  color: #000;
  width: 32px;
  text-align: center;
`;

const ValueArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ValueText = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #f44336;
  user-select: none;
`;

const ValueInput = styled.input`
  width: 70px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  padding: 0;
  border: none;
  background: transparent;
  color: #f44336;
  outline: none;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
