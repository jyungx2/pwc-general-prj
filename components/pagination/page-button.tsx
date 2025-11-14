import { PaginationButtonProps } from "@/models/pagination";

export default function PaginationButton({
  children,
  isActive,
  disabled,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "min-w-16 h-16 leading-16 inline-flex items-center justify-center rounded-md cursor-pointer",
        "transition-colors",
        disabled && "cursor-not-allowed text-grey-400 bg-default",
        isActive
          ? "bg-black text-white border-black"
          : "bg-white text-gray-700 hover:bg-gray-100",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
