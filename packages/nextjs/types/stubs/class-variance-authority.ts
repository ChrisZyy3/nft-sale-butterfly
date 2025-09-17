export type ClassValue = string | number | null | boolean | undefined | ClassValue[] | { [key: string]: ClassValue };

export interface CvaConfig {
  variants?: Record<string, Record<string, ClassValue>>;
  defaultVariants?: Record<string, string>;
}

function toArray(value: ClassValue): ClassValue[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .filter(([, active]) => Boolean(active))
      .map(([key]) => key);
  }

  return [value];
}

export function cx(...inputs: ClassValue[]): string {
  return inputs
    .flatMap(toArray)
    .filter(item => typeof item === "string" || typeof item === "number")
    .map(item => String(item))
    .filter(Boolean)
    .join(" ");
}

export function cva(base?: ClassValue, config?: CvaConfig): (options?: Record<string, unknown>) => string {
  const baseClass = cx(base ?? "");
  const variants = config?.variants ?? {};
  const defaults = config?.defaultVariants ?? {};

  return (options?: Record<string, unknown>) => {
    const resolved = new Set<string>();

    Object.entries({ ...defaults, ...options }).forEach(([key, value]) => {
      if (typeof value === "string") {
        const variantClass = variants[key]?.[value];
        if (variantClass) {
          cx(variantClass)
            .split(" ")
            .forEach(part => resolved.add(part));
        }
      }
    });

    if (options && typeof options.className === "string") {
      options.className
        .split(" ")
        .filter(Boolean)
        .forEach(part => resolved.add(part));
    }

    const variantClasses = Array.from(resolved);
    const className = options && typeof options.className === "string" ? options.className : "";

    return cx(baseClass, variantClasses, className);
  };
}

export type VariantProps<T = unknown> = Record<string, unknown> & { __variantType?: T };
