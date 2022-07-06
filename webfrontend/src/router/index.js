import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage"
import SignIn from "@/components/SignIn"
import signUp from "@/components/SignUp"
import MainPage from '../views/MainPage.vue';
import SeeFile from '../views/SeeFile.vue';
import SendFile from '../views/SendFile.vue';
import NotFound from '../views/NotFound.vue';
import store from '@/store' // short for @/store/index
import two_auth from '@/components/two_auth'

// les différents chemins 
const routes = [{
        // page mère 
        name: "HomePage",
        // url de la page 
        path: '/',
        component: HomePage,
        // nom de la page sur l'onglet
        meta: {
            title: "Page d'accueil",
            requiresAuth: false
        }
    },
    //pages filles, à partir de la page mère 
    {
        name: 'SignIn',
        path: '/SignIn',
        component: SignIn,
        meta: {
            title: "Page de connexion",
            requiresAuth: false
        }
    },
    {
        name: "SignUp",
        path: '/SignUp',
        component: signUp,
        meta: {
            title: "Page d'inscriptions",
            requiresAuth: false
        }
    },
    {
        name: 'Main Page',
        path: '/MainPage',
        component: MainPage,
        meta: {
            title: "Page d'accès aux fichiers",
            requiresAuth: true
        }
    },
    {
        name: 'See File',
        path: '/seefile',
        component: SeeFile,
        meta: {
            title: 'Voir les fichiers',
            requiresAuth: true
        }
    },
    {
        name: 'Send file',
        path: '/sendfile',
        component: SendFile,
        meta: {
            title: 'Envoyer des fichiers',
            requiresAuth: true
        }
    },
    {
        name: 'notFound',
        path: '/:pathMatch(.*)',
        component: NotFound,
        meta: {
            title: '404 Not Found',
            requiresAuth: false
        }
    },
    {
        name: 'two_auth',
        path: '/two_auth',
        component: two_auth,
        meta: {
            title: "Page de 2FA",
            requiresAuth: true
        }
    },

];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

/*Change le titre de l'onglet en fonction de la page cliqué
l'affiche aussi sur la console. Meta sert ici à changer le titre de l'onglet*/
router.afterEach((to) => {
    document.title = to.meta.title;
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.getters.authentificated) {
            next()
        } else {
            next('/SignIn')
        }
    } else {
        next()
    }
})

export default router;