<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { supabaseClient } from "./db";

    let viewLogIn : boolean = true;
    let email : string;
    let password : string;

    const handleClick = () => {
        if(viewLogIn) logIn();
        else signUp();
    }

    const logIn = async() => {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email:email,
            password:password,
        });

        
        if(error){
            // To do
            return;
        }

        redirectToTodos();
    }

    const signUp = async() => {
        const { data, error } = await supabaseClient.auth.signUp({
            email:email,
            password:password,
        });

        if(error){
            // To do
            return;
        }

        // To do check email alert
    }

    onMount( () => {
        if($page.data.session) redirectToTodos();
    });

    const redirectToTodos = () => {
        location.href = "/todos"
    }
</script>

<div class="w-screen h-screen flex justify-center items-center">
    <div class="grid grid-cols-2 w-1/2">
        <button class="h-10 { viewLogIn ? "bg-neutral-800 hover:bg-neutral-700" : "bg-green-800 hover:bg-green-700" } rounded-tl-md"
        on:click={() => viewLogIn = false }
        >
            Sign Up
        </button>

        <button class="h-10 { viewLogIn ? "bg-green-800 hover:bg-green-700" : "bg-neutral-800 hover:bg-neutral-700" } rounded-tr-md"
        on:click={() => viewLogIn = true }
        >
            Log In
        </button>

        <div class="col-span-2 flex justify-center items-center h-48 border-2 border-t-0 border-neutral-800 rounded-b-md"> 
            <form class="w-10/12 space-y-4" on:submit|preventDefault={handleClick}>
                <input bind:value={email} type="email" placeholder="email" class="w-full placeholder-neutral-500 bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-md outline-none text-center">
                <input bind:value={password} type="password" placeholder="password" class="w-full placeholder-neutral-500 bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-md outline-none text-center">
                <button type="submit" class="w-full bg-green-800 hover:bg-green-700 rounded-md outline-none text-center">{viewLogIn ? "Log In" : "Sign Up"}</button>
            </form>
        </div>
    </div>
</div>
