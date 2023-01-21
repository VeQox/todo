import type { Actions, PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type ITodo from '$lib/todo'

export const actions: Actions = {
  add: async (event) => {
    const { request } = event
    const { supabaseClient } = await getSupabase(event)
    const formData = await request.formData()

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const user_id = (await supabaseClient.auth.getUser()).data.user?.id;

    if (user_id == undefined
      || title.length < 3
      || title.length > 100
      || description.length > 250) return;

    const { error } = await supabaseClient
      .from("todos")
      .insert({
        user_id: user_id,
        title: title,
        description: description,
      });

    if (error) return;
    return { success: true }
  },
  remove: async (event) => {
    const { url } = event
    const { supabaseClient } = await getSupabase(event)

    const id = url.searchParams.get('id');

    if (id === null) return;

    const { error } = await supabaseClient
      .from("todos")
      .delete()
      .match({ id: id });

    if (error) return;
    return { success: true }
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
    if (id === null) return;

    if (user_id == undefined
      || title?.length < 3
      || title?.length > 100
      || description?.length > 250)  return;

    const { error } = await supabaseClient
      .from("todos")
      .update({
        title: title,
        description: description,
        deadline: deadline
      })
      .match({ id: id });

    if (error) return;
    return { success: true }
  },
  completed: async (event) => {
    const { request, url } = event
    const { supabaseClient } = await getSupabase(event)
    const formData = await request.formData()

    const id = url.searchParams.get('id');
    if (id === null) return;

    const completed = formData.get("completed") as string === "true";

    const { error } = await supabaseClient
      .from("todos")
      .update({ completed: !completed })
      .match({ id: id });

    if (error) return;
    return { success: true }
  }
}
 
export const load = (async (event) => {
  const { session, supabaseClient } = await getSupabase(event);

  if (!session)
    throw redirect(303, '/auth');

  const { data } = await supabaseClient.from("todos").select("*");
  
  const todos = parseTodosFromDB(data).sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));

  return {
    todos
  };
}) satisfies PageServerLoad;

const parseTodoFromDB = (dbTodo: any): ITodo => {
  return {
      id: dbTodo.id,
      title: dbTodo.title,
      description: dbTodo.description,
      deadline: dbTodo.deadline,
      completed: dbTodo.completed,
      created_at: new Date(dbTodo.created_at),
      edit: false,
  };
}

const parseTodosFromDB = (dbTodos: any[] | null) => {
  let todos: ITodo[] = []
  if(!dbTodos) return todos;
  dbTodos.forEach(dbTodo => todos.push(parseTodoFromDB(dbTodo)));
  return todos;
}