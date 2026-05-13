import ServiceDetail from '@/views/ServiceDetail';
import { Suspense } from 'react';
export default function Page() { 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceDetail />
    </Suspense>
  ); 
}