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
      "days",
    );
  };

  function daysBetween(first: Date, second: Date) {
    let one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    let two = new Date(
      second.getFullYear(),
      second.getMonth(),
      second.getDate(),
    );

    let millisecondsPerDay = 1000 * 60 * 60 * 24;
    let millisBetween = two.getTime() - one.getTime();
    let days = millisBetween / millisecondsPerDay;

    return Math.floor(days);
  }

  //export let form : ActionData;
  let todoTitle: string = "";
  let todoDescription: string = "";
  $: todoTitleCharCount = todoTitle.length;
  $: todoDescriptionCharCount = todoDescription.length;
</script>

<form
  action="?/add"
  method="post"
  use:enhance={({ form, data, action, cancel }) => {
    return async ({ result, update }) => {
      if (result.type === "success") {
        todoTitle = "";
        todoDescription = "";
      }
    };
  }}
>
  <div class="grid grid-cols-6 md:grid-cols-12">
    <div class="col-span-5 md:col-span-11">
      <input
        bind:value={todoTitle}
        name="title"
        placeholder="todo text"
        class="text-2xl w-full placeholder-neutral-500 bg-neutral-900 border-2 border-t-0 border-neutral-800 focus:border-neutral-700 rounded-bl-md outline-none text-center"
      />
    </div>
    <div
      class="{todoTitleCharCount > 100
        ? 'text-red-800'
        : todoTitleCharCount > 80
        ? 'text-orange-800'
        : 'text-green-800'} flex items-center justify-center bg-neutral-900 border-b-2 border-r-2 border-neutral-800 focus:border-neutral-700 rounded-br-md"
    >
      <p>{todoTitleCharCount}</p>
    </div>

    <div class="col-span-5 md:col-span-11">
      <input
        bind:value={todoDescription}
        name="description"
        placeholder="todo description"
        class="text-md w-full placeholder-neutral-500 bg-neutral-900 border-2 border-t-0 border-neutral-800 focus:border-neutral-700 rounded-bl-md outline-none text-center"
      />
    </div>
    <div
      class="{todoDescriptionCharCount > 250
        ? 'text-red-800'
        : todoDescriptionCharCount > 200
        ? 'text-orange-800'
        : 'text-green-800'} flex items-center justify-center bg-neutral-900 border-b-2 border-r-2 border-neutral-800 focus:border-neutral-700 rounded-br-md"
    >
      <p>{todoDescriptionCharCount}</p>
    </div>
  </div>
  <button type="submit" />
</form>

<div class="w-full flex justify-center">
  <div class="w-11/12 text-center space-y-3">
    {#each $Todos as todo, i}
      <!--
      <div class="col-span-11 flex justify-center">
        <form method="post" action="?/update&id={todo.id}" use:enhance={({form, data, action, cancel}) => {
            return async ({ result, update }) => {
            };
          }}>
          <div class="flex">
            <input name="title" class="w-4/6 text-center bg-neutral-900 border border-neutral-800 outline-none rounded-md" bind:value={todo.title}>
            <input name="deadline" type="date" class="w-2/6 text-right bg-neutral-900 border border-neutral-800 outline-none rounded-md" bind:value={todo.deadline}>
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
      -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="w-full grid grid-cols-12 border border-neutral-800 rounded-md hover:cursor-pointer"
        on:click={() => alert("div")}
      >
        <div class="flex justify-center items-center">
          <form
            method="post"
            action="?/completed&id={todo.id}"
            use:enhance={({ form, data, action, cancel }) => {
              return async ({ result, update }) => {};
            }}
          >
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
              on:click={(event) => event.stopPropagation()}
            />
          </form>
        </div>
        <div class="col-span-10">
          <p class="w-full border-b border-neutral-800">
            {todo.title}
          </p>
        </div>
        <div class="">
          <form
            method="post"
            action="?/remove&id={todo.id}"
            use:enhance
            on:click={(event) => event.stopPropagation()}
          >
            <button type="submit">X</button>
            <form />
          </form>
        </div>
        <div class="flex justify-center items-center">
          <p class="text-xs text-neutral-400">
            {getDateFormated(todo.deadline)}
          </p>
        </div>
        <div class="col-span-11">
          <p class="w-full text-sm text-start">
            {todo.description}
          </p>
        </div>
      </div>
    {/each}
  </div>
</div>
