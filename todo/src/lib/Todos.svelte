<script lang="ts">
    import { page } from "$app/stores";
    import type ITodo from "$lib/Todo";
    import { supabaseClient } from "./db";
    import { Todos } from "../stores/todostore"

    let newTodoText : string;

    const addTodo = async() => {
        if($page.data.session == null) return;
        if(newTodoText.length == 0) return

        const {data, error} = await supabaseClient.from("todos").insert({
            text:newTodoText,
            user_id:$page.data.session.user.id
        });

        newTodoText = "";
    }
    const changeStateOfTodo = async(i : number) => {
        let Todo : ITodo = $Todos[i];

        Todo.completed = !Todo.completed;

        const {error} = await supabaseClient.from("todos")
            .update({completed: Todo.completed})
            .match({id:Todo.id})
    }
    const changeTextOfTodo = async(i : number) => {
        let Todo : ITodo = $Todos[i];

        const {error} = await supabaseClient.from("todos")
            .update({text:Todo.text})
            .match({id:Todo.id});
    }
    const removeTodoFromList = async(i : number) => {
        let Todo : ITodo = $Todos[i];

        const {error} = await supabaseClient.from("todos")
            .delete()
            .match({id:Todo.id})
    }
</script>

<form on:submit|preventDefault={() => {
    addTodo()
}}>
    <input bind:value={newTodoText} placeholder="todo text" class="text-2xl w-full placeholder-neutral-500 bg-neutral-900 border-2 border-t-0 border-neutral-800 focus:border-neutral-700 rounded-b-md outline-none text-center"/>
</form>

<div class="mt-1">
{#each $Todos as todoItem, i}
    <div>
        <div class="grid grid-cols-12 items-center cursor-pointer pt-2">
            <div class="flex justify-center items-center">
                <button class="h-6 w-6 border rounded-full border-neutral-700 hover:bg-green-800 {todoItem.completed ? "bg-green-800" : ""}" on:click={() => changeStateOfTodo(i)}></button>
            </div>
            <div class="col-span-10">
                <form class="w-full h-full" on:submit|preventDefault={() => changeTextOfTodo(i)}>
                    <input bind:value={todoItem.text} class="w-full { todoItem.completed ? "text-neutral-500" : "" } pl-2 placeholder-neutral-500 bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-md outline-none">
                </form>
            </div>
            <div class="flex justify-center items-center">
                <button class="h-6 w-6 border rounded-full border-neutral-700 hover:bg-red-800" on:click={() => removeTodoFromList(i)}></button>
            </div>
        </div>
    </div>
{/each}
</div>