<script lang="ts">
  let viewLogIn : boolean = true;
</script>

<div class="flex justify-center items-center h-screen">
    <div class="w-1/2">
        <div class="grid grid-cols-2">
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

            {#if viewLogIn}
            <div class="col-span-2 flex justify-center items-center h-48 border-2 border-t-0 border-neutral-800 rounded-b-md"> 
                <form class="w-10/12 space-y-4" method="post" action="?/login">
                    <input name="email" autocomplete="email" type="email" placeholder="email" class="w-full placeholder-neutral-500 bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-md outline-none text-center">
                    <input name="password" autocomplete="current-password" type="password" placeholder="password" class="w-full placeholder-neutral-500 bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-md outline-none text-center">
                    <button type="submit" class="w-full bg-green-800 hover:bg-green-700 rounded-md outline-none text-center">{viewLogIn ? "Log In" : "Sign Up"}</button>
                </form>
            </div>
            {:else}
            <div class="col-span-2 flex justify-center items-center h-48 border-2 border-t-0 border-neutral-800 rounded-b-md"> 
                <form class="w-10/12 space-y-4" method="post"  action="?/register">
                    <input name="email" autocomplete="email" type="email" placeholder="email" class="w-full placeholder-neutral-500 bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-md outline-none text-center">
                    <input name="password" autocomplete="current-password" type="password" placeholder="password" class="w-full placeholder-neutral-500 bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-md outline-none text-center">
                    <button type="submit" class="w-full bg-green-800 hover:bg-green-700 rounded-md outline-none text-center">{viewLogIn ? "Log In" : "Sign Up"}</button>
                </form>
            </div>
            {/if}
        </div>
    </div>
</div>
