import { SubmitHandler } from "react-hook-form";

export type CorpCodeEntry = {
  corp_code: string;
  corp_name: string;
  stock_code?: string;
};

export type FinancialSearchFormValues = {
  corpName: string;
  bsnsYear: string;
  reprtCode: string;
  fsDiv: string;
};

export type FinancialSearchFormProps = {
  // onSubmit: (values: FinancialSearchFormValues) => void;
  // 부모 페이지(OptionalPage)에서 props(useMutation)로 받은 onSubmit 함수는 financial-search-form에서 react-hook-form 기능의 handleSubmit()안에서 불러와지므로...
  onSubmit: SubmitHandler<FinancialSearchFormValues>;
  loading: boolean;
  hasSearched: boolean;
};

export type DartSingleAccountResponse = {
  status: string; // "000" 이면 성공
  message: string;
  list?: DartSingleAccountRow[];
};

export type DartSingleAccountRow = {
  sj_nm: string; // 재무제표 종류명 (재무상태표, 손익계산서 등)
  sj_div?: string;
  account_id?: string;
  account_nm: string; // 계정명
  account_detail?: string; // 계정 상세
  thstrm_nm: string; // 당기 명칭 (ex. 2024.12)
  thstrm_amount: string; // 당기 금액
  frmtrm_nm?: string; // 전기 명칭
  frmtrm_amount?: string; // 전기 금액
  bfefrmtrm_nm?: string; // 전전기 명칭
  bfefrmtrm_amount?: string; // 전전기 금액
};

export type FinancialTableRow = {
  statementName: string; // sj_nm
  accountName: string; // account_nm
  accountDetail?: string; // account_detail
  thstrmName: string;
  thstrmAmount: string;
  frmtrmName?: string;
  frmtrmAmount?: string;
  bfefrmtrmName?: string;
  bfefrmtrmAmount?: string;
};

export type FinancialTableProps = {
  rows: FinancialTableRow[];
};

export type FinancialApiResponse = {
  corpName: string;
  corpCode: string;
  bsnsYear: string;
  reprtCode: string;
  fsDiv: string;
  rows: FinancialTableRow[];
};
