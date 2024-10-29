import { Images } from '@/types/imagesType';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const getImages = async () => {
  const { data, error } = await supabase.from('images').select('*');

  if (error) throw new Error(error.message);
  return data as Images[];
};
