export interface TopNavProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export interface BottomNavProps {
  description?: string;
  primaryLabel: string;
  onPrimaryClick?: () => void;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
}

export type ProfileType = {
  userId: number;
  email: string;
  nickname: string;
  token: string;
};
