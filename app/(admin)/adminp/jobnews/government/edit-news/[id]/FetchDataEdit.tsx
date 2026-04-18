import React from 'react'
import EditShowJobNewsGov from './ShowDataEdit'
import { getDataEditNewsGov } from '@/actions/admin/jobnews/government/fetchNews/Actions'
import { fetchDataProduct } from '@/actions/admin/products/government/Actions'


export default async function FetchDataEdit({ id }: { id: string }) {
    const getDataGov = await getDataEditNewsGov(id)
    const data = await fetchDataProduct()
    const products = data?.products || []
    return (
        <div>
            <EditShowJobNewsGov getDataGov={getDataGov} getDataProduct={products} />
        </div>
    )
}
