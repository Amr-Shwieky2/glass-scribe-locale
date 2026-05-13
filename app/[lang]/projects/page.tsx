import Projects from '@/views/Projects';
import { Suspense } from 'react';
export default function Page() { 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Projects />
    </Suspense>
  ); 
}