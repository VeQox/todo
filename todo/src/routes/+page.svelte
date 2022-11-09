<!--

<script lang="ts">
    import { page } from '$app/stores';
    import { supabaseClient } from '$lib/db';

    const signUp = async() => {
        const { data, error } = await supabaseClient.auth.signUp({
            email:email,
            password:password,
        });

        console.log(error)
    }

    const signIn = async() => {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email:email,
            password:password,
        })
    }

    const logout = async() => {
        const {error} = await supabaseClient.auth.signOut()
    }

    let email : string;
    let password : string;
</script>

{#if !$page.data.session}
    <h1>I am not logged in</h1>
{:else}
    <h1>Welcome {$page.data.session.user.email}</h1>
    <p>I am logged in!</p>
{/if}

<form on:submit|preventDefault={signUp}>
    <input bind:value={email} type="email" placeholder="email">
    <input bind:value={password} type="password" placeholder="password">
    <button>Sign Up</button>
</form>

<div class="py-4"></div>

<form on:submit|preventDefault={signIn}>
    <input bind:value={email} type="email" placeholder="email">
    <input bind:value={password} type="password" placeholder="password">
    <button>Sign In</button>
</form>

<div class="py-4"></div>

<button on:click={logout}>Logout</button>
-->

<script lang="ts">
    import Auth from "$lib/Auth.svelte";
</script>

<Auth/>