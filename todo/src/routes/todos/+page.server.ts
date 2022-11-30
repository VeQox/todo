import type { Actions } from './$types'
import { invalid, redirect } from '@sveltejs/kit'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const actions: Actions = {
  add: async (event) => {
    const { request } = event
    const { supabaseClient } = await getSupabase(event)
    const formData = await request.formData()

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const user_id = (await supabaseClient.auth.getUser()).data.user?.id;

    if(user_id == undefined || title == undefined || title.length < 3 || title.length > 100 || description.length > 250) return { success: false}

    const {error, data} = await supabaseClient
      .from("todos")
      .insert({
        user_id: user_id,
        title:title,
        description:description,
      });

    if(error) return { success: false}
    return { success: true}
  },
  remove: async (event) => {
    const { request, url} = event
    const { supabaseClient } = await getSupabase(event)
    const formData = await request.formData()

    const id = url.searchParams.get('id');

    const {data, error} = await supabaseClient
      .from("todos")
      .delete()
      .match({id:id});

    return {sucess: error === null}
  },
  update: async (event) => {
    const { request } = event
    const { supabaseClient } = await getSupabase(event)
    const formData = await request.formData()
  },
}