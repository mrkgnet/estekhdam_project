import ShowDataResources from "./ShowDataResources";
import {
  fetchAllProductDataAction,
  fetchMainCategoriesAction,
} from "@/actions/user/productsCat/Actions";

type Props = {
  currentPage: number;
  searchQuery: string;
  categoryQuery: string;
  limit: number;
};

export default async function FetchDataUser(props: Props) {
  const [productResponse, categoryResponse] = await Promise.all([
    fetchAllProductDataAction(props.currentPage, props.limit, props.searchQuery, props.categoryQuery),
    fetchMainCategoriesAction(),
  ]);

  if (!productResponse?.success || !productResponse?.data) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 border border-red-100 rounded-lg max-w-7xl mx-auto mt-10">
        خطایی در دریافت لیست محصولات رخ داد. لطفا دوباره تلاش کنید.
      </div>
    );
  }

  return (
    <ShowDataResources
      {...props}
      initialProducts={productResponse.data}
      initialTotalCount={productResponse.totalCount ?? 0}
      initialTotalPages={productResponse.totalPages ?? 1}
      categories={categoryResponse?.success ? categoryResponse.data : []}
    />
  );
}
