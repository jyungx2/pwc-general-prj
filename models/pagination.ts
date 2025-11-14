export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type PaginationButtonProps = {
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};
