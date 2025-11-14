import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: ReactNode;
  black?: boolean;
  white?: boolean;
  rounded?: boolean;
  blocked?: boolean;
}
