import { writable, get } from "svelte/store";
import { supabaseClient } from "$lib/db";
import type ITodo from "$lib/todo";
import { component_subscribe } from "svelte/internal";

const table = "todos";
const maxTextLength = 280;

export const Todos = writable([] as ITodo[]);

const subscribeToDatabase = async(table : string) => {
    supabaseClient
        .channel(`public:${table}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: table }, ( payload ) => { handleInsertEvent(payload) })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: table }, ( payload ) => { handleUpdateEvent(payload) })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: table }, ( payload ) => { handleDeleteEvent(payload) })
        .subscribe();
}

const handleInsertEvent = (payload : any) => {
    const newTodoItem : ITodo = payload.new;

    console.log(newTodoItem)

    Todos.update( (todo) => {
        return [...todo, newTodoItem];
    });

    console.log("handleInsertEvent")
}
const handleUpdateEvent = (payload : any) => {
    const newTodoItem : ITodo = payload.new;
    const oldID = payload.old.id;

    let todos = get(Todos);

    for(let i = 0; i < todos.length; i++) {
        if(todos[i].id === oldID){
            todos[i] = newTodoItem;
            Todos.set(todos);
            console.log("handleUpdateEvent")
            return;
        }
    }
}
const handleDeleteEvent = (payload : any) => {
    const ID = payload.old.id;

    Todos.update(todos => todos.filter(todo => todo.id != ID));
    console.log("handleDeleteEvent")
}

export const loadTodos = async() => {
    const { error, data } = await supabaseClient
        .from("todos")
        .select("*");

    // Todo sort data

    await subscribeToDatabase("todos");

    if(error) return false;
    Todos.set(data);
    return true;
}