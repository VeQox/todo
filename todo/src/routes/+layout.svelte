<script>
  import "../app.css"
  import { supabaseClient } from '$lib/db'
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'

  onMount(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(() => {
      invalidate('supabase:auth')
    })

    return () => {
      subscription.unsubscribe()
    }
  })
</script>

<div class="w-screen h-screen bg-neutral-900 text-neutral-400 overflow-hidden">
  <div class="border-b-2 border-neutral-800">
    <ul class="flex justify-around items-center">
      <li>
        <a href="/">Home</a>
      </li>
      <li>  
        <a href="auth/">Auth</a>
      </li>
      <li>  
        <a href="account/">Account</a>
      </li>
    </ul>
  </div>
  <slot />
</div>

