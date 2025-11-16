import { ButtonProps } from "@/models/button";
import classNames from "classnames";

function Button({
  children,
  icon,
  black,
  white,
  rounded,
  blocked,
  ...rest
}: ButtonProps) {
  // if (Number(!!primary) + Number(!!secondary) + 0 > 1) {
  //   console.warn("Only one of primary, secondary, etc. should be true");
  // }

  const classes = classNames(
    "flex gap-2 items-center justify-center w-auto h-[3.8rem] px-[1.6rem] leading-[2.2rem] tracking-[0%] border font-medium text-[1.6rem] whitespace-nowrap cursor-pointer",
    {
      "bg-grey-60 text-white cursor-not-allowed": blocked,
      "rounded-[0.4rem]": rounded,
      "border-default bg-white text-black": white,
      "bg-black text-white": black,
    },
    rest.className
  );

  return (
    <button {...rest} disabled={blocked} className={classes}>
      {icon}
      {children}
    </button>
  );
}

export default Button;
