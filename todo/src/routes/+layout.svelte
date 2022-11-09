<script lang="ts">
  import "../app.css";

  // Setup connection to supabase backend
  import { supabaseClient } from "$lib/db";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    const { data: {subscription} } = supabaseClient.auth.onAuthStateChange(()=> {
      invalidate("supabase:auth")
    });

    return () => {
      subscription.unsubscribe();
    }
  }); 

</script>

<div class="w-screen h-screen bg-neutral-900 text-neutral-400">
  <slot />
</div>
