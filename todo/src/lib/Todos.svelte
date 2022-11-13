<script lang="ts">
    import { Todos, loadTodos, addTodoItem, deleteTodoItem, updateTodoItemStatus, updateTodoItemText } from "../stores/todostore"
    import { onMount } from "svelte";

    let newTodoText : string = "";

    const addTodo = async() => {
        console.log(await addTodoItem(newTodoText))
        newTodoText = "";
    }
    const changeStateOfTodo = async(i : number) => {
        console.log(await updateTodoItemStatus($Todos[i].id, $Todos[i].completed))
    }
    const changeTextOfTodo = async(i : number) => {
        console.log(await updateTodoItemText($Todos[i].id, $Todos[i].text))
    }
    const removeTodoFromList = async(i : number) => {
        console.log(await deleteTodoItem($Todos[i].id));
    }

    onMount( async() => {
        await loadTodos();
    }) 
</script>

<div class="grid grid-cols-6 md:grid-cols-12">
    <div class="col-span-5 md:col-span-11">
        <form on:submit|preventDefault={() => {
            addTodo()
        }}>
            <input bind:value={newTodoText} placeholder="todo text" class="text-2xl w-full placeholder-neutral-500 bg-neutral-900 border-2 border-t-0 border-neutral-800 focus:border-neutral-700 rounded-bl-md outline-none text-center"/>
        </form>
    </div>
    <div class="{newTodoText.length > 280 ? "text-red-800" : newTodoText.length > 230 ? "text-orange-800" : "text-green-800"} flex items-center justify-center bg-neutral-900 border-b-2 border-r-2 border-neutral-800 focus:border-neutral-700 rounded-br-md">
        <p>{newTodoText.length}/280</p>
    </div>

</div>


<div class="mt-1">
{#each $Todos as todoItem, i}
    <div>
        <div class="grid grid-cols-12 items-center cursor-pointer pt-2">
            <div class="flex justify-center items-center">
                <button class="h-6 w-6 border rounded-full border-neutral-700 hover:bg-green-800 {todoItem.completed ? "bg-green-800" : ""}" on:click={() => changeStateOfTodo(i)}></button>
            </div>
            <div class="col-span-10">
                <form class="w-full h-full" on:submit|preventDefault={() => changeTextOfTodo(i)}>
                    <input bind:value={todoItem.text} class="w-full { todoItem.completed ? "text-neutral-500" : "" } pl-2 placeholder-neutral-500 bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-md outline-none">
                </form>
            </div>
            <div class="flex justify-center items-center ">
                <button class="h-6 w-6 border rounded-full border-neutral-700 hover:bg-red-800" on:click={() => removeTodoFromList(i)}></button>
            </div>
        </div>
    </div>
{/each}
</div>