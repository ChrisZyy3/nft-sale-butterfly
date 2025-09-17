import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export const Slot = <T extends ElementType>(props: ComponentPropsWithoutRef<T>): ReactNode => {
  const { children } = props as { children?: ReactNode };
  return children ?? null;
};
