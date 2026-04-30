import { getDataCategory } from '@/actions/category/Actions'
import HeaderTop from './HeaderTop'

export default async function FetchDataCatNav() {
    // واکشی داده در سرور برای سئو و رندر اولیه
    const response = await getDataCategory();
    
    return (
      <HeaderTop initialCategories={response} />
    )
}
