import { fetchTicketUserAction } from "@/actions/user/dashboard/support/fetch/Actions";
import React from "react";
import TicketsListPage from "./ShowDataDU";

interface FetchTiketDUProps {
  page: number;
}

export default async function FetchTiketDU({ page }: FetchTiketDUProps) {
  const response = await fetchTicketUserAction(page);

  return (
    <div>
      <TicketsListPage response={response} />
    </div>
  );
}