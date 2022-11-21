<script>
  import { page } from '$app/stores'
</script>

{#if !$page.data.session}
<h1>I am not logged in</h1>
{:else}
<h1>Welcome {$page.data.session.user.email}</h1>
<p>I am logged in!</p>
{/if}

<form method="post" action="/auth?/logout" class="w-1/2">
  <button class="w-full bg-green-800 hover:bg-green-700 rounded-md outline-none text-center">Logout</button>
</form>
