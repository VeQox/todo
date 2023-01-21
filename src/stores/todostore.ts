import { writable, get } from "svelte/store";
import { supabaseClient } from "$lib/db";
import type ITodo from "$lib/todo";

export const Todos = writable([] as ITodo[]);

const subscribeToDatabase = async (table: string) => {
    supabaseClient
        .channel(`public:${table}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: table }, (payload) => { handleInsertEvent(payload) })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: table }, (payload) => { handleUpdateEvent(payload) })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: table }, (payload) => { handleDeleteEvent(payload) })
        .subscribe();
}

const handleInsertEvent = (payload: any) => {
    const newTodoItem: ITodo = payload.new;

    Todos.update((todo) => {
        return [...todo, newTodoItem];
    });
}
const handleUpdateEvent = (payload: any) => {
    const newTodoItem: ITodo = payload.new;
    const oldID = payload.old.id;

    let todos = get(Todos);

    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === oldID) {
            todos[i] = newTodoItem;
            Todos.set(todos);
            return;
        }
    }
}
const handleDeleteEvent = (payload: any) => {
    const ID = payload.old.id;

    Todos.update(todos => todos.filter(todo => todo.id != ID));
}

export const loadTodos = async (data : ITodo[]) => {
    if (!data) return false;

    Todos.set(data);

    await subscribeToDatabase("todos");
    return true;
}