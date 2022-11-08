<script lang="ts">
    import type { ITodo } from "./todo";

    let data : ITodo[] = [
     {id:"3", text:"Todo item 3", completed:false, created_at:new Date(), user_id:"12123123"},
     {id:"4", text:"Todo item 4", completed:false, created_at:new Date(), user_id:"12123123"},
     {id:"5", text:"Todo item 5", completed:false, created_at:new Date(), user_id:"12123123"},
     {id:"6", text:"Todo item 6", completed:false, created_at:new Date(), user_id:"12123123"},
    ]
</script>

{#each data as todoItem, i}
    <div class="grid grid-cols-12 bg-gray-800 mt-1 w-1/2">
        <div class="col-span-1">{i}</div>
        <div class="col-span-10 text-center">
            <p>{todoItem.text}</p>
        </div>
        <div class="col-span-1">
            <button>X</button>
        </div>
    </div>
{/each}