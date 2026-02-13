import React, { useEffect, useState } from "react";
import styled from "styled-components";
import pizzaWork from "../../assets/images/pizza_work_img.svg";

interface ProgressbarCardProps {
  complete: number; // 완료 개수
  incomplete?: number; // 미완료 개수
  durationMs?: number; // 애니메이션 시간
  ease?: "linear" | "easeOutCubic";
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const ProgressbarCard: React.FC<ProgressbarCardProps> = ({
  complete,
  incomplete = 0,
  durationMs = 1200,
  ease = "easeOutCubic",
}) => {
  const safeTotal = complete + incomplete <= 0 ? 1 : complete + incomplete;
  const clampedCompleted = clamp(complete, 0, safeTotal);
  const completeRatio = clampedCompleted / safeTotal;

  const [animRatio, setAnimRatio] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const animate = (t: number) => {
      const elapsed = t - start;
      const p = Math.min(1, elapsed / durationMs);
      let eased: number;
      if (ease === "linear") eased = p;
      else eased = 1 - Math.pow(1 - p, 3);
      setAnimRatio(completeRatio * eased);
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [completeRatio, durationMs, ease]);

  const pizzaLeftPercent = animRatio * 100;

  return (
    <CardWrapper>
      <BarWrapper>
        <PizzaImg
          src={pizzaWork}
          alt="pizza progress"
          style={{ left: `calc(${pizzaLeftPercent}% - 14px)` }}
        />
        <BarBackground>
          <GrowBar style={{ width: `${animRatio * 100}%` }} />
        </BarBackground>
        <LabelsRow>
          <LabelLeft>미완료</LabelLeft>
          <LabelLeft>완료</LabelLeft>
        </LabelsRow>
      </BarWrapper>
    </CardWrapper>
  );
};

export default ProgressbarCard;

const CardWrapper = styled.div`
  width: 320px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

const BarWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const PizzaImg = styled.img`
  position: absolute;
  top: -18px;
  width: 28px;
  pointer-events: none;
`;

const BarBackground = styled.div`
  position: relative;
  width: 100%;
  height: 7px;
  margin-top: 34px;
  overflow: hidden;
  background: #fdd9d7;
  border-radius: 20px;
`;

const GrowBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #f44336;
  border-radius: 20px;
`;

const LabelsRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  margin-top: 6px;
`;

const LabelLeft = styled.span`
  color: #6b6b6b;
  font-size: 10px;
`;
