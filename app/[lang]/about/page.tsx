import About from '@/views/About';
import { Suspense } from 'react';
export default function Page() { 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <About />
    </Suspense>
  ); 
}