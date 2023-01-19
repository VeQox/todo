<script lang="ts">
    import { page } from "$app/stores";

    let email = $page.data.session?.user.email;
</script>

<div class="h-[calc(100vh-26px)] flex justify-center items-center">
    <form method="post" action="/auth?/logout" class="w-1/2 space-y-4">
        <input
            bind:value={email}
            type="email"
            readonly
            class="w-full placeholder-neutral-500 bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-md outline-none text-center"
        />
        <button
            class="w-full bg-green-800 hover:bg-green-700 rounded-md outline-none text-center"
            >Logout</button
        >
    </form>
</div>
