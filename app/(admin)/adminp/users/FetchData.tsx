import { fetchDataUserAction } from "@/actions/admin/uesrs/Actions";
import { fetchDataProduct } from "@/actions/admin/products/government/Actions";
import InfoUserData from "./UserData"; // نام فایلی که InfoUserData در آن است

type Props = {
  currentPage: number;
  searchQuery: string;
  limit: number;
}

export default async function FetchDataUser({ currentPage, searchQuery, limit }: Props) {

  // واکشی همزمان (موازی) اطلاعات کاربران و محصولات برای افزایش سرعت لود
  const [dataUsers, getDataProduct] = await Promise.all([
    fetchDataUserAction(currentPage, limit, searchQuery),
    fetchDataProduct()
  ]);
  return (      <InfoUserData dataUsers={dataUsers} dataProducts={getDataProduct} />
  )


}
