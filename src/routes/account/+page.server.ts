import { supabaseClient } from '$lib/db';
import type { PageServerLoad } from './$types';
 
export const load = (async () => {
  return {
    email: (await supabaseClient.auth.getUser()).error?.message
  };
}) satisfies PageServerLoad;