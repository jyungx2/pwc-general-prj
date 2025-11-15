import { Dispatch, ReactNode, SetStateAction } from "react";

export type Company = {
  id: number;
  email: string;
  company_name: string;
  memo: string;
  created_at: string;
};

export type Favorites = {
  items: Company[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type Props = {
  selectedCompany: Company;
  onClose: () => void;
};

export type CompanyTableProps = {
  favorites: Company[];
  onRowClick: (company: Company) => void;
  selectedIds: number[];
  // onChangeSelectedIds: (ids: number[]) => void;
  onChangeSelectedIds: Dispatch<SetStateAction<number[]>>;
  onDeleteOne: (id: number) => void;
};

export type SearchableDropdownProps = {
  label?: string;
  placeholder?: string;
  onChange?: (option: string) => void;
  onModalOpen?: Dispatch<SetStateAction<boolean>>;
};

export type SubHeaderProps = {
  title: string;
  subtitle: string;
  primaryBtn?: ReactNode;
  secondaryBtn?: ReactNode;
};
