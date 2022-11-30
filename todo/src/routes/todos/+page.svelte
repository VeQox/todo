<script lang="ts">
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import { loadTodos, Todos } from "../../stores/todostore";
 
  onMount(async() => {
    await loadTodos();
  });

  export let form;
  let todoTitle : string = "";
  let todoDescription : string = "";
  $: todoTitleCharCount = todoTitle.length;
  $: todoDescriptionCharCount = todoDescription.length;
</script>

<form action="?/add" method="post" use:enhance={({form, data, action, cancel}) => {
        return async ({ result, update }) => {
          if(result.type === "success"){
            todoTitle = "";
            todoDescription = "";
          }
        };
    }}>
  <div class="grid grid-cols-6 md:grid-cols-12">
    <div class="col-span-5 md:col-span-11">
        <input bind:value={todoTitle} name="title" placeholder="todo text" class="text-2xl w-full placeholder-neutral-500 bg-neutral-900 border-2 border-t-0 border-neutral-800 focus:border-neutral-700 rounded-bl-md outline-none text-center"/>
    </div>
    <div class="{todoTitleCharCount > 100 ? "text-red-800" : todoTitleCharCount > 80 ? "text-orange-800" : "text-green-800"} flex items-center justify-center bg-neutral-900 border-b-2 border-r-2 border-neutral-800 focus:border-neutral-700 rounded-br-md">
      <p>{todoTitleCharCount}</p>
    </div>

    <div class="col-span-5 md:col-span-11">
      <input bind:value={todoDescription} name="description" placeholder="todo description" class="text-md w-full placeholder-neutral-500 bg-neutral-900 border-2 border-t-0 border-neutral-800 focus:border-neutral-700 rounded-bl-md outline-none text-center"/>
    </div>
    <div class="{todoDescriptionCharCount > 250 ? "text-red-800" : todoDescriptionCharCount > 200 ? "text-orange-800" : "text-green-800"} flex items-center justify-center bg-neutral-900 border-b-2 border-r-2 border-neutral-800 focus:border-neutral-700 rounded-br-md">
      <p>{todoDescriptionCharCount}</p>
    </div>
  </div>  
  <button type="submit"></button>
</form>


<div class="w-full flex justify-center">
  <div class="w-11/12 grid grid-cols-12 space-y-5">
    {#each $Todos as todo, i}
      <div class="col-span-11 flex justify-center">
        <form method="post" action="?/update&id={todo.id}" use:enhance={({form, data, action, cancel}) => {
            return async ({ result, update }) => {
            };
          }}>
          <div class="flex">
            <input name="title" class="w-4/6 text-center bg-neutral-900 border border-neutral-800 outline-none rounded-md" bind:value={todo.title}>
            <input readonly class="w-2/6 text-right bg-neutral-900 border border-neutral-800 outline-none rounded-md" bind:value={todo.deadline}>
          </div>
          <input name="description" class="w-full bg-neutral-900 border border-neutral-800 outline-none rounded-md" bind:value={todo.description}>
          <button type="submit"></button>
        </form>
      </div>
      <div class="">
        <form method="post" action="?/remove&id={todo.id}"  use:enhance={({form, data, action, cancel}) => {
          return async ({ result, update }) => {
          };
      }}>
          <button type="submit">X</button>
        </form>
      </div>
    {/each}
  </div>
</div>