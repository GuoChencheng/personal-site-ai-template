import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: "default" | "narrow" | "wide";
};

const sizes = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl"
};

export function Container({ className = "", size = "default", ...props }: ContainerProps) {
  return <div className={`mx-auto w-full px-5 sm:px-6 lg:px-8 ${sizes[size]} ${className}`} {...props} />;
}
