import React from "react";
import TopBanner from "./TopBanner";
import { getLatestActiveBanner } from "@/actions/admin/topBanner/Actions";

export default async function FetchDataTopBanner() {
  const response = await getLatestActiveBanner();
  const banner = response?.data || null;

  return <TopBanner initialBanner={banner} />;
}