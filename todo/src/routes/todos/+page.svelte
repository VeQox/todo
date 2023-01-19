<script lang="ts">
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import { loadTodos, Todos } from "../../stores/todostore";
  import type { ActionData } from "./$types";

  export let data: {
    data: any[] | undefined;
  };

  onMount(async () => {
    await loadTodos(data.data);
  });

  let dateFormatter = new Intl.RelativeTimeFormat("en", {
    localeMatcher: "best fit", // other values: "lookup"
    numeric: "auto", // other values: "auto"
    style: "short", // other values: "short" or "narrow"
  });

  const getDateFormated = (date: string) => {
    return dateFormatter.format(
      daysBetween(new Date(Date.now()), new Date(date)),
      "days"
    );
  };

  function daysBetween(first: Date, second: Date) {
    let one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    let two = new Date(
      second.getFullYear(),
      second.getMonth(),
      second.getDate()
    );

    let millisecondsPerDay = 1000 * 60 * 60 * 24;
    let millisBetween = two.getTime() - one.getTime();
    let days = millisBetween / millisecondsPerDay;

    return Math.floor(days);
  }

  //export let form : ActionData;
  let todoTitle: string = "";
  let todoDescription: string = "";
</script>

<form
  action="?/add"
  method="post"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === "success") {
        todoTitle = "";
        todoDescription = "";
      }
    };
  }}
>
  <input
    bind:value={todoTitle}
    name="title"
    placeholder="todo text"
    class="text-2xl w-full placeholder-neutral-500 bg-inherit border-b-2 border-neutral-800 outline-none text-center
      {todoTitle.length > 100
      ? 'border-red-800'
      : todoTitle.length > 80
      ? 'border-orange-700'
      : todoTitle.length > 2
      ? 'border-green-800'
      : 'border-neutral-800'}
    "
  />

  <input
    bind:value={todoDescription}
    name="description"
    placeholder="todo description"
    class="text-md w-full placeholder-neutral-500 bg-inherit border-b-2 border-neutral-800 outline-none text-center
      {todoDescription.length > 250
      ? 'border-red-800'
      : todoDescription.length > 200
      ? 'border-orange-700'
      : todoDescription.length > 0
      ? 'border-green-800'
      : 'border-neutral-800'}
    "
  />

  <button type="submit" />
</form>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="w-full flex justify-center">
  <div class="w-11/12 text-center space-y-3">
    {#each $Todos as todo, i}
      {#if todo.edit}
        <div class="w-full border border-neutral-800 rounded-md">
          <form
            class="grid grid-cols-12"
            method="post"
            action="?/update&id={todo.id}"
            use:enhance={() => {
              todo.edit = !todo.edit;
            }}
          >
            <input
              class="col-span-9 bg-inherit outline-none text-center border-b border-neutral-800"
              name="title"
              bind:value={todo.title}
            />
            <input
              type="date"
              class="col-span-3 bg-inherit outline-none text-center border-b border-neutral-800"
              name="deadline"
              bind:value={todo.deadline}
            />
            <input
              class="col-span-11 bg-inherit outline-none text-center"
              name="description"
              bind:value={todo.description}
            />

            <button type="submit">S</button>
          </form>
        </div>
      {:else}
        <div
          class="w-full grid grid-cols-12 border border-neutral-800 rounded-md"
        >
          <div class="flex justify-center items-center">
            <form method="post" action="?/completed&id={todo.id}" use:enhance>
              <input
                name="completed"
                readonly
                bind:value={todo.completed}
                class="hidden"
              />
              <button
                type="submit"
                class="rounded-full {todo.completed
                  ? 'bg-green-800'
                  : 'border-2 border-neutral-800'}  w-4 h-4"
                on:click={(e) => e.stopPropagation()}
              />
            </form>
          </div>
          <div class="col-span-10" on:click={() => {}}>
            <p class="w-full border-b border-neutral-800">
              {todo.title}
            </p>
          </div>
          <form
            method="post"
            action="?/remove&id={todo.id}"
            use:enhance
            on:click={(e) => e.stopPropagation()}
          >
            <button type="submit">X</button>
          </form>
          <div class="flex justify-center items-center">
            <p class="text-xs text-neutral-400">
              {getDateFormated(todo.deadline)}
            </p>
          </div>
          <div class="col-span-10">
            <p class="w-full text-sm text-start">
              {todo.description}
            </p>
          </div>
          <button on:click={() => (todo.edit = !todo.edit)}>/</button>
        </div>
      {/if}
    {/each}
  </div>
</div>
