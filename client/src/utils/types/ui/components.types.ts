import { IconType } from 'react-icons';
export interface StepperProps {
  currentStage: number;
  completed?: boolean;
}
export interface BackgroundLayoutProps {
  className?: string;
  children: any;
}
export interface MenuItemProps {
  id: number;
  Icon: IconType;
  name: string;
  path: string;
}
export interface MenuItemsPayload {
  top?: MenuItemProps[];
  bottom?: MenuItemProps[];
}
