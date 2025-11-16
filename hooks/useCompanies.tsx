"use client";

import { axiosClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

export function useCompanies() {
  return useQuery<string[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosClient.get("/companies");
      const data = res.data.companies;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
