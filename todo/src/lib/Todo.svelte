<script lang="ts">
    import type { ITodo } from "$lib/todo";
    import { text } from "svelte/internal";
    import { supabaseClient } from "./db";

    export let Todo : ITodo;

    const removeTodo = async() => {
        const {error} = await supabaseClient.from("todos").update({completed: true}).match({id:Todo.id})
    
        console.log("removed todo " + Todo.id);
    }
</script>

<div class="bg-gray-800 my-1 cursor-pointer" on:click={removeTodo}>
    <p>{Todo.text}</p>
</div>