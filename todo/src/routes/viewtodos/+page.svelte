<script lang="ts">
    import { page } from '$app/stores';
    import { supabaseClient } from "$lib/db"
    import { onMount } from "svelte";
    import type{ ITodo } from '$lib/todo';
    import Todo from "$lib/Todo.svelte"

    const fetchdata = async() => {
        const {data, error} = await supabaseClient.from("todos").select();

        if(error) return null;

        return data;
    }

    const addData = async(text : string) => {
        if($page.data.session == null) return;

        const {data, error} = await supabaseClient.from("todos").insert({
            text:text,
            user_id:$page.data.session.user.id
        });
    };


    onMount(async() => {
        let tmpdata = await fetchdata();
        if(tmpdata == null) return;

        todos = tmpdata;
    })


    let todos : ITodo[] = [];
</script>

{#if todos.length != 0}
    {#each todos as todo}
        <Todo Todo={todo}/>
    {/each}
{/if}

