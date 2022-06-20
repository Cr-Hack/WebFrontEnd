<template>
        <nav class="nav">

            <router-link to="/"><img src="../assets/logo.png" alt="logo"></router-link>
            <router-link to="/SignIn">Connexion</router-link>
            <router-link to="/SignUp">Inscription</router-link>

        </nav>

        <h1>
            Notre Page 
        </h1>

        <h2>Pourquoi-nous ?</h2>

        <h2>Qui sommes-nous ? </h2>

        <div class="container">
            <div class="Myriam">

            </div>

            <div class="Joséphine">

            </div>

            <div class="Antoine">

            </div>
            
            <div class="Helene">

            </div>
            
            <div class="Ari">

            </div>
            
            <div class="Clément">

            </div>
        
        </div>

        <footer>
            Copyrigth : Cr'Hack 
        </footer>
</template>

<script>
//import SignInVue from './SignIn.vue'
//import SignUpVue from './SignUp.vue'

export default {
    name : 'HomePage',
    components : {
        //SignInVue, SignUpVue, 
    }, 
    setup(){

    }, 
    data(){
        /*return {
            v : false
        }*/
    }, 
    methods : {

    }

}
</script>

<style>
    .nav {
        background-color: pink;
        position : -webkit-sticky ; 
    }

    img {
        border-radius: 50%;
        width : 100px ; 
    }

</style>