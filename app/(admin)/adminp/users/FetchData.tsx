import { fetchDataUserAction } from "@/actions/admin/uesrs/Actions";
import InfoUserData from "./UserData";
import { GetDataPlansUser } from "@/actions/admin/plans/Actions";

type Props = {
  currentPage: number;
  searchQuery: string;
  limit: number;
};

export default async function FetchDataUser({ currentPage, searchQuery, limit }: Props) {
  // اجرای همزمان هر دو درخواست برای جلوگیری از ایجاد Waterfall
  const [dataUsers, dataPlans] = await Promise.all([
    fetchDataUserAction(currentPage, limit, searchQuery),
    GetDataPlansUser()
  ]);

  return <InfoUserData dataUsers={dataUsers} plans={dataPlans?.data || []} />;
}
