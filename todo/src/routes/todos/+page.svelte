<script lang="ts">
    import { page } from "$app/stores"
    import Todos from "$lib/Todos.svelte"
    import { onMount } from "svelte";

    onMount(() => {
        if($page.data.session == null){
            location.href = "/";
        } 
    })
</script>

<Todos/>