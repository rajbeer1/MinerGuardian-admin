'use client'
import MegaGraph from '@/components/MegaGraph'
import { useParams } from 'next/navigation';
import React from 'react'

const Page = () => {
  const { email } = useParams();

  return (

    <div>
      <MegaGraph email={email} />
    </div>
  )
}

export default Page