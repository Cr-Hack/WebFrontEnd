import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage"
import SignIn from "@/components/SignIn"
import signUp from "@/components/SignUp"
import HelloWorld from '@/components/HelloWorld'
import MainPage from '../views/MainPage.vue';
import SeeFile from '../views/SeeFile.vue';
import SendFile from '../views/SendFile.vue';
import NotFound from '../views/NotFound.vue';

// les différents chemins 
const routes = [
    {
        // page mère 
        name : "HomePage", 
        // url de la page 
        path : '/', 
        component : HomePage, 
        // nom de la page sur l'onglet
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
    }, 
    {
        name : "HelloWorld", 
        path: '/HelloWorld', 
        component: HelloWorld,
        meta :{
            title : "Page de test"
        } 
    },
    {
        name : 'Main Page',
        // a changer 
        path : '/', 
        component : MainPage,
        meta: {
            title : "Page d'accueil"
        }
    },
    {
        name : 'See File',
        path : '/seefile',
        component : SeeFile,
        meta: {
            title : 'Voir les fichiers'
        }
    },
    {
        name: 'Send file',
        path : '/sendfile',
        component : SendFile,
        meta: {
            title : 'Envoyer des fichiers'
        }
    },
    {
        name : 'notFound',
        path : '/:pathMatch(.*)',
        component: NotFound,
        meta : {
            title : '404 Not Found'
        }
    }, 


] ; 


const router = createRouter({
    history: createWebHistory(), 
    routes, 
}); 

 /*Change le titre de l'onglet en fonction de la page cliqué
l'affiche aussi sur la console. Meta sert ici à changer le titre de l'onglet*/
router.afterEach((to) => {
    document.title=to.meta.title ; 
}); 


export default router ; 