export const prerender = true;
export const csr = true;

import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutLoad = async (event) => {
  const { session } = await getSupabase(event);
  return { session };
};

