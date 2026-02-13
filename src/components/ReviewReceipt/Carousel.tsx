import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";

interface CarouselProps {
  children: React.ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const [current, setCurrent] = useState(0);
  const count = React.Children.count(children);

  // Drag state
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef<number | null>(null);
  const deltaRef = useRef<number>(0);
  const [dragDelta, setDragDelta] = useState(0); // for re-render style update
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (count <= 1) return;
      startXRef.current = e.clientX;
      deltaRef.current = 0;
      setDragDelta(0);
      setDragging(true);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [count]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || startXRef.current == null) return;
      const w = wrapperRef.current?.offsetWidth || 1;
      const rawDelta = e.clientX - startXRef.current;
      let adjusted = rawDelta;
      // edge resistance
      if (
        (current === 0 && rawDelta > 0) ||
        (current === count - 1 && rawDelta < 0)
      ) {
        adjusted = rawDelta * 0.35; // resistance factor
      }
      deltaRef.current = adjusted;
      setDragDelta(adjusted / w); // fraction of one viewport width
    },
    [dragging, current, count]
  );

  const finishDrag = useCallback(() => {
    if (!dragging) return;
    const wFraction = deltaRef.current; // pixels delta stored
    const w = wrapperRef.current?.offsetWidth || 1;
    const ratio = wFraction / w; // fraction of slide width
    let next = current;
    const threshold = 0.18; // fraction threshold (~18%)
    if (ratio <= -threshold && current < count - 1) {
      next = current + 1;
    } else if (ratio >= threshold && current > 0) {
      next = current - 1;
    }
    setCurrent(next);
    // reset drag
    startXRef.current = null;
    deltaRef.current = 0;
    setDragDelta(0);
    setDragging(false);
  }, [dragging, current, count]);

  const onPointerUp = useCallback(() => finishDrag(), [finishDrag]);
  const onPointerLeave = useCallback(() => finishDrag(), [finishDrag]);

  return (
    <CarouselWrapper
      ref={wrapperRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      <CarouselInner
        count={count}
        current={current}
        $dragging={dragging}
        $dragDelta={dragDelta}
      >
        {React.Children.map(children, (child, idx) => (
          <CarouselItem key={idx} count={count}>
            {child}
          </CarouselItem>
        ))}
      </CarouselInner>
      <DotWrapper>
        {Array.from({ length: count }).map((_, idx) => (
          <Dot
            key={idx}
            active={current === idx}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </DotWrapper>
    </CarouselWrapper>
  );
};

export default Carousel;

const CarouselWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const CarouselInner = styled.div<{
  count: number;
  current: number;
  $dragging: boolean;
  $dragDelta: number;
}>`
  display: flex;
  width: ${({ count }) => count * 100}%;
  ${({ count, current, $dragDelta }) => {
    const base = (current * 100) / count;
    const offset = ($dragDelta * 100) / count;
    return `transform: translateX(-${base - offset}%);`;
  }}
  transition: ${({ $dragging }) =>
    $dragging ? "none" : "transform 0.4s cubic-bezier(0.4,0,0.2,1)"};
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
`;

const CarouselItem = styled.div<{ count: number }>`
  flex: 0 0 ${({ count }) => 100 / count}%;
  width: ${({ count }) => 100 / count}%;
  display: flex;
  justify-content: center;
`;

const DotWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  position: absolute;
  top: 500px;
  left: 0;
  right: 0;
  bottom: 0;
  height: fit-content;
  z-index: 0;
`;

const Dot = styled.button<{ active: boolean }>`
  all: unset;
  width: 12px;
  height: 12px;
  min-width: 12px;
  min-height: 12px;
  max-width: 12px;
  max-height: 12px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#F44336" : "#d9d9d9")};
  cursor: pointer;
  margin: 0;
  padding: 0;
  display: inline-block;
  transition: background 0.2s;
`;
