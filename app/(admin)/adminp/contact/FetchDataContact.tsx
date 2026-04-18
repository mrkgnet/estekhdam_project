import { fetchDataContactAction } from '@/actions/admin/contact/fetch/Actions'
import React from 'react'
import ShowDataContact from './ShowDataContact'

export default async function FetchDataContact() {
    const response = await fetchDataContactAction()
    
    return (
        <div>
            <ShowDataContact response={response} />
        </div>
    )
}
