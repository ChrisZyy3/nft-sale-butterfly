declare module "@radix-ui/react-slot" {
  import * as React from "react";

  export const Slot: React.ComponentType<React.PropsWithChildren<unknown>>;
}

declare module "class-variance-authority" {
  type ClassVarianceAuthorityResult = (...args: any[]) => string;

  export function cva(...args: any[]): ClassVarianceAuthorityResult;

  export type VariantProps<T extends ClassVarianceAuthorityResult> = Parameters<T>[0];
}

declare module "tailwind-merge" {
  export function twMerge(...classLists: Array<string | false | null | undefined>): string;
}
