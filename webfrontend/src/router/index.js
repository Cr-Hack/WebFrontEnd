import { createRouter, createWebHashHistory } from "vue-router";
import MainPage from '../views/MainPage.vue';
import SeeFile from '../views/SeeFile.vue';
import SendFile from '../views/SendFile.vue';
import NotFound from '../views/NotFound.vue';
const routes = [
    {
        name : 'Main Page',
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
];


const router = createRouter({
    history : createWebHashHistory(),
    routes
});

router.afterEach((to) => {
    document.title = to.meta.title;
}) /*Change le titre de l'onglet en fonction de la page cliqué
l'affiche aussi sur la console. Meta sert ici à changer le titre de l'onglet*/

export default router 