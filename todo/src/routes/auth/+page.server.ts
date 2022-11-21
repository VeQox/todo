import type { Actions } from './$types'
import { invalid, redirect } from '@sveltejs/kit'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const actions: Actions = {
  login: async (event) => {
    const { request, cookies, url } = event
    const { session, supabaseClient } = await getSupabase(event)
    const formData = await request.formData()

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return invalid(400, {
        error: 'login failed',
        values: {
          email,
        },
      })
    }

    throw redirect(303, '/')
  },

  register: async (event) => {
    const { request, cookies, url } = event
    const { session, supabaseClient } = await getSupabase(event)
    const formData = await request.formData();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabaseClient.auth.signUp({
      password:password,
      email:email,
    });

    if(error) {
      return invalid(402, {
        error: 'register failed',
        values: {
          email,
        },
      })
    }

    throw redirect(303, "/")
  },

  logout: async (event) => {
    const { supabaseClient } = await getSupabase(event)
    await supabaseClient.auth.signOut()
    throw redirect(303, '/')
  },
}