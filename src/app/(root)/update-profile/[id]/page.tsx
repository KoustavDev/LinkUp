import UpdateUser from '@/components/special/UpdateUser';
import React from 'react'

type types = {
  params: Promise<{ id: string }>;
};
const page = async ({ params }: types) => {
  const userId = (await params).id;;
  return <UpdateUser id={userId} />;
};

export default page