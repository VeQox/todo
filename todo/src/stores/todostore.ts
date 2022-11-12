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

export const loadTodos = async() => {
    const { error, data } = await supabaseClient
        .from("todos")
        .select("*");
    
    // Todo sort data

    if(error) return false;
    Todos.set(data);
    return true;
}
export const addTodoItem = async(text : string) => {

    if(checkTextLength(text)) return false;

    const user_id = (await supabaseClient.auth.getUser()).data.user?.id;

    if(user_id === undefined) return false;

    const { data, error } = await supabaseClient
        .from(table)
        .insert({
            text:text,
            user_id:user_id,
        });

    if(error) return false;
    return true;
}
export const deleteTodoItem = async(id : number) => {
    const { data, error } = await supabaseClient
        .from(table)
        .delete()
        .match({id:id});

    if(error) return false;
    return true;
}
export const updateTodoItemStatus = async(id: number, completed : boolean) => {
    const { data, error } = await supabaseClient
        .from(table)
        .update({completed: !completed})
        .match({id:id});

    if(error) return false;
    return true;
}
export const updateTodoItemText = async(id : number, text : string) => {

    if(checkTextLength(text)) return false;

    const { data, error } = await supabaseClient
        .from(table)
        .update({text: text})
        .match({id:id});

    if(error) return false;
    return true;
}

const checkTextLength = (text : string) => {
    return text.length > maxTextLength;
}

subscribeToDatabase("todos");