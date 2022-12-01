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

    if(user_id == undefined 
      || title.length < 3 
      || title.length > 100 
      || description.length > 250) return invalid(400, {text: "invalid params"})

    const {error} = await supabaseClient
      .from("todos")
      .insert({
        user_id: user_id,
        title:title,
        description:description,
      });

    if(error) return invalid(400, {text:"insert failed"})
    return { success: true}
  },
  remove: async (event) => {
    const {url} = event
    const { supabaseClient } = await getSupabase(event)

    const id = url.searchParams.get('id');

    if(id === null) return invalid(400, {text:"invalid id"})

    const {error} = await supabaseClient
      .from("todos")
      .delete()
      .match({id:id});

    if(error) return invalid(400, {text:"delete failed"})
    return { success: true}
  },
  update: async (event) => {
    const { request, url } = event
    const { supabaseClient } = await getSupabase(event)
    const formData = await request.formData()

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const deadline = formData.get("deadline") as string;
    const user_id = (await supabaseClient.auth.getUser()).data.user?.id;
    
    const id = url.searchParams.get('id');
    if(id === null) return invalid(400, {text:"invalid id"})

    if(user_id == undefined 
      || title?.length < 3 
      || title?.length > 100 
      || description?.length > 250) return invalid(400, {text: "invalid params"})

    const {error} = await supabaseClient
      .from("todos")
      .update({
        title:title,
        description:description, 
        deadline:deadline
      })
      .match({id:id});

    if(error) return invalid(400, {text:"delete failed"})
    return { success: true}
  },
}

import type { PageServerLoad } from './$types';
 
export const load: PageServerLoad = async (event) => {
  const { session, supabaseClient} = await getSupabase(event);

  if (!session)
    throw redirect(303, '/');

  const {data} = await supabaseClient.from("todos").select("*");

  return {
    data
  };
}