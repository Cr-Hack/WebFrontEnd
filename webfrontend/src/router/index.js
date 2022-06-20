import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage"
import signIn from "@/components/SignIn"
import signUp from "@/components/SignUp"

const routes = [
    {
        name : "Page d'accueil", 
        path : '/', 
        component : HomePage, 
    }, 
    {
        name : 'Page de connexion', 
        path: '/', 
        component: signIn, 
    }, 
    {
        name : "Page d'inscription", 
        path: '/', 
        component: signUp, 
    }
] ; 

const router = createRouter({
    history: createWebHistory(), 
    routes, 
})


export default router ; 