import { getAllBanners } from "@/actions/admin/topBanner/Actions";
import ShowDataTopBannerPage from "./showData";

export default async function TopBannerPage() {
  const response = await getAllBanners();
  const banners = response.success ? response.data : [];

  return (
    <ShowDataTopBannerPage initialData={banners} />
  );
}