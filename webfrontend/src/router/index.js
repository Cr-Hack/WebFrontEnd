import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage"
import signIn from "@/components/SignIn"
import signUp from "@/components/SignUp"

// les différents chemins 
const routes = [
    {
        // page mère 
        name : "Page d'accueil", 
        path : '/', 
        component : HomePage, 
    }, 
    //pages filles, à partir de la page mère 
    {
        name : 'Page de connexion', 
        path: '/SignIn', 
        component: signIn, 
    }, 
    {
        name : "Page d'inscription", 
        path: '/SignUp', 
        component: signUp, 
    }

] ; 


const router = createRouter({
    history: createWebHistory(), 
    routes, 
})


export default router ; 