import { writable, get } from "svelte/store";
import { supabaseClient } from "$lib/db";
import type ITodo from "$lib/todo";

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

export const loadTodos = async(data: any[] | undefined) => { 
    if(!data) return false;

    await subscribeToDatabase("todos");

    Todos.set(parseTodosFromDB(data).sort((a:ITodo, b:ITodo) => Date.parse(a.deadline) - Date.parse(b.deadline)));
    return true;
}

const parseTodoFromDB = (dbTodo : ITodoDB) : ITodo  => {
    return {
        id:dbTodo.id,
        title:dbTodo.title,
        description:dbTodo.description,
        deadline:dbTodo.deadline,
        completed:dbTodo.completed,
        created_at:new Date(dbTodo.created_at),
    }
}

const parseTodosFromDB = (dbTodos : ITodoDB[]) => {
    let todos : ITodo[] = []
    for(let dbTodo of dbTodos){
        todos.push(parseTodoFromDB(dbTodo));
    }
    return todos;
}

interface ITodoDB {
    completed:boolean,
    id:number,
    //yyyy-MM-ddThh-mm-ss.ms
    created_at:string,
    //yyyy-MM-dd
    deadline:string,
    description:string,
    title:string,
}