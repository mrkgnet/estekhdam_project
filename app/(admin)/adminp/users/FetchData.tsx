// FetchDataUser.tsx
import { fetchDataUserAction } from "@/actions/admin/uesrs/Actions";
import InfoUserData from "./UserData";

type Props = {
  currentPage: number;
  searchQuery: string;
  limit: number;
}

export default async function FetchDataUser({ currentPage, searchQuery, limit }: Props) {
  const dataUsers = await fetchDataUserAction(currentPage, limit, searchQuery);
 
  return <InfoUserData dataUsers={dataUsers} />;
}
