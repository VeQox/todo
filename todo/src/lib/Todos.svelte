<script lang="ts">
    import { page } from "$app/stores";
    import type { ITodo } from "$lib/todo";
    import { onMount } from "svelte";
    import { supabaseClient } from "./db";

    let Todos : ITodo[] = [];
    let newTodoText : string;

    const addTodo = async() => {
        if($page.data.session == null) return;
        if(newTodoText.length == 0) return

        const {data, error} = await supabaseClient.from("todos").insert({
            text:newTodoText,
            user_id:$page.data.session.user.id
        });

        newTodoText = "";
        loadTodos();
    }

    const loadTodos = async() => {
        const {data, error} = await supabaseClient.from("todos")
            .select();
    
        if(error)  return;
        if(data == null) return;

        Todos = data;
    }

    const changeStateOfTodo = async(i : number) => {
        let Todo : ITodo = Todos[i];

        Todo.completed = !Todo.completed;

        const {error} = await supabaseClient.from("todos")
            .update({completed: Todo.completed})
            .match({id:Todo.id})
        
        Todos = Todos;
    }

    const removeTodoFromList = async(i : number) => {
        let Todo : ITodo = Todos[i];

        const {error} = await supabaseClient.from("todos")
            .delete()
            .match({id:Todo.id})

        loadTodos();
    }

    onMount(() => {
        loadTodos();
    })
</script>

<form on:submit|preventDefault={() => {
    addTodo()
}}>
    <input bind:value={newTodoText} class="text-center text-2xl w-full outline-none border-b-4" placeholder="todo text"/>
</form>

{#each Todos as todoItem, i}
    <div class="grid grid-cols-12 items-center cursor-pointer pt-2">
        <div class="flex justify-center items-center">
            <button class="w-7 h-7 border hover:bg-gray-500" on:click={() => changeStateOfTodo(i)}></button>
        </div>
        {#if todoItem.completed}
            <p class="col-span-10 opacity-40">{todoItem.text}</p>
        {:else}
            <p class="col-span-10">{todoItem.text}</p>
        {/if}
        <div>
            <button class="w-7 h-7 border hover:bg-red-500" on:click={() => removeTodoFromList(i)}></button>
        </div>
    </div>
{/each}