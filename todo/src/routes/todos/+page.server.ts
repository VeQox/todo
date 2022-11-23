import type { Actions } from './$types'
import { invalid, redirect } from '@sveltejs/kit'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const actions: Actions = {
  add: (event) => {
    const { request } = event
  },
  updateText: (event) => {

  },
  updateStatus: (event) => {

  },
  remove: (event) => {

  },
  test: (event) => {
    console.log(event)
  }
}