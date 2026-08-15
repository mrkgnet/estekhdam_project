import React from 'react'

import QCCShow from './QCCShow'
import { getPlatformStats } from '@/actions/qcc/Actions'

export default async function QCCFetch() {
  const stats = await getPlatformStats()

  return (
    <div>
      <QCCShow stats={stats} />
    </div>
  )
}