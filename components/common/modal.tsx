import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  modalClassName?: string;
}

// components/ui/Modal.jsx
export default function Modal({
  children,
  onClose,
  modalClassName,
  className,
}: ModalProps) {
  // 바깥쪽 배경 클릭 시 닫기
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center ${modalClassName}`}
      onClick={handleBackgroundClick}
    >
      <div
        className={`flex flex-col bg-white rounded-xl lg:min-w-md shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()} // 2. 클릭 이벤트 전파 방지(버블링: 자식 -> 부모)하여 모달 안쪽 클릭 시 모달이 닫히지 않도록 함
      >
        {children}
      </div>
    </div>
  );
}
