export type Company = {
  id: number;
  email: string;
  company_name: string;
  memo: string;
  created_at: string;
};

export type Props = {
  data: Company;
  onClose: () => void;
};

export type CompanyTableProps = {
  onRowClick: (company: Company) => void;
};

export type SearchableDropdownProps = {
  label?: string;
  placeholder?: string;
  onChange?: (option: string) => void;
};
