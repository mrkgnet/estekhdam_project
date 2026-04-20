import fetchIssueQuestionAdmin from '@/actions/admin/issu-question/fetch/Actions'
import React from 'react'
import ShowQuestionIssu from './ShowQuestionIssu'

export default async function FetchQuestionIssu() {
    const response = await fetchIssueQuestionAdmin()
    return (
        <ShowQuestionIssu response={response} />
    )
}
