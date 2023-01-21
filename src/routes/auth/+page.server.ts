import type { Actions } from './$types'
import { redirect } from '@sveltejs/kit'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const actions: Actions = {
  login: async (event) => {
    const { request } = event
    const { supabaseClient } = await getSupabase(event)
    const formData = await request.formData()

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    throw redirect(303, "/todos")
  },

  register: async (event) => {
    const { request } = event
    const { supabaseClient } = await getSupabase(event)
    const formData = await request.formData();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabaseClient.auth.signUp({
      password:password,
      email:email,
    });
  },

  logout: async (event) => {
    const { supabaseClient } = await getSupabase(event)
    await supabaseClient.auth.signOut()
    throw redirect(303, '/')
  },
}