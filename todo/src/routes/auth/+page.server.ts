import { tick } from "svelte"
import { supabaseClient } from "$lib/db";
import { invalid, redirect } from '@sveltejs/kit';

export const prerender = false;

/** @type {import('./$types').Actions} */
export const actions = {
    login: async ({cookies, request} : {cookies : any, request:any}) => {
        await tick();
        const tmp = await request.formData();
        const email = tmp.get("email");
        const password : string = tmp.get("password");

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            password:password,
            email:email,
        });
        
        if(error) return invalid(400);

        console.log(data)

        throw redirect(303, "/todos")
    },
    register: async ({cookies, request} : {cookies : any, request : any}) => {
        await tick();
        const data = await request.formData();
        const email = data.get("email");
        const password : string = data.get("password");

        if(!email) return invalid(400, {email});

        if(!password) return invalid(400, {password});
        if(!password.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$")) return invalid(400);

        const { error } = await supabaseClient.auth.signUp({
            password:password,
            email:email,
        });
        
        if(error) return invalid(400);

        throw redirect(303, "/todos")
    }
};