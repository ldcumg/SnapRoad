import React from 'react';
import { createClient } from '@/supabase/server';

export default async function page() {
  // const supabase = createClient();
  // const { data } = await supabase.auth.getSession();
  // console.log(`user`, data.session?.user);

  return (
    <div>
      <h1 className='text-7xl font-bold'>Page</h1>
    </div>
  );
}
