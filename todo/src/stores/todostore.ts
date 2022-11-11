import { writable, get } from "svelte/store";
import { supabaseClient } from "$lib/db";
import type ITodo from "$lib/Todo";

type Payload = {
    new:{
        completed:boolean,
        created_at:Date,
        id:number,
        text:string,
        user_id:string,
    },
    old:{
        id:number,
    },
    schema:string,
    table:string,
    eventType:string,
    commit_timestamp:Date,
}

export const Todos = writable([] as ITodo[]);

const subscribeToDatabase = async(table : string) => {
    supabaseClient
        .channel(`public:${table}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: table }, ( payload ) => { addTodo(payload) })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: table }, ( payload ) => { updateTodos(payload) })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: table }, ( payload ) => { removeTodo(payload) })
        .subscribe();
}
 
const updateTodos = (payload : any) => {
    const newTodoItem : ITodo = payload.new;
    const oldID = payload.old.id;

    let index = getIndex(oldID);
    if(index === -1) return;
    let todos = getTodos();

    todos[index] = newTodoItem;

    Todos.set(todos)
}

const removeTodo = (payload : any) => {
    const oldID = payload.old.id;


    let index = getIndex(oldID);
    if(index === -1) return;
    let todos = getTodos();

    todos.splice(index, 1);

    Todos.set(todos);
}

const addTodo = (payload : any) => {
    const newTodoItem : ITodo = payload.new;

    let todos = getTodos();
    todos.push(newTodoItem);

    Todos.set(todos);
}

const getIndex = (id : number) => {
    const todos = getTodos();
    let i = 0;

    for(const todo of todos){
        if(todo.id === id){
            return i;
        }
        i++;
    }

    return -1;
}

const getTodos = () => {
    return get(Todos);
}

subscribeToDatabase("todos");