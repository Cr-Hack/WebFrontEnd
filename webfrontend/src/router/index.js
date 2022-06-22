import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage"
import SignIn from "@/components/SignIn"
import signUp from "@/components/SignUp"

// les différents chemins 
const routes = [
    {
        // page mère 
        name : "Page d'accueil", 
        // url de la page 
        path : '/', 
        component : HomePage, 
        // nom de la page 
        meta :{
            title : "Page d'accueil"
        }
    }, 
    //pages filles, à partir de la page mère 
    {
        name : 'Page de connexion', 
        path: '/SignIn', 
        component: SignIn, 
        meta :{
            title : "Page de connexion"
        }
    }, 
    {
        name : "Page d'inscription", 
        path: '/SignUp', 
        component: signUp,
        meta :{
            title : "Page d'inscriptions"
        } 
    }

] ; 


const router = createRouter({
    history: createWebHistory(), 
    routes, 
}); 

router.afterEach((to) => {
    document.title=to.meta.title ; 
}); 


export default router ; 