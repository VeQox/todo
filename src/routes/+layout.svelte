<script lang="ts">
  import "../app.css";
</script>

<div class="border-b-2 border-neutral-800">
  <ul class="flex justify-around items-center">
    <li>
      <a href="/todos">Todos</a>
    </li>
    <li>
      <a href="/auth">Auth</a>
    </li>
    <li>
      <a href="/account">Account</a>
    </li>
  </ul>
</div>
<slot />

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.neutral.900);
    color: theme(colors.neutral.400);
  }
</style>