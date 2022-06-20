<template>
        <nav class="nav">

            <router-link to="/"><img src="../assets/logo.png" alt="logo"></router-link>
            <router-link to="/SignIn" class="txt">Connexion</router-link>
            <router-link to="/SignUp" class="txt">Inscription</router-link>

        </nav>

        <h1>
            Notre Page 
        </h1>

        <h2>Pourquoi-nous ?</h2>

        <h2>Qui sommes-nous ? </h2>

        <div class="container">
            <div class="student Myriam" >
                <img src="../assets/myriam1.jpg" alt="photo de myriam"/>
                <h4>Myriam Amor</h4>
            </div>

            <div class="student Josephine">
                <img src="../assets/josephine1.jpg" alt="photo de josephine"/>
                <h4>Joséphine de Lestrange</h4>
            </div>

            <div class="student Antoine">
                <img src="../assets/antoine1.jpg" alt="photo d antoine"/>
                <h4>Antoine Gay</h4>
            </div>
            
            <div class="student Helene">
                <img src="../assets/helene1.png" alt="photo d helene"/>
                <h4>Helene Huang</h4>
            </div>
            
            <div class="student Ari">
                <img src="../assets/ari1.jpg" alt="photo d ari"/>
                <h4>Ari Rangandin</h4>
            </div>
            
            <div class="student Clément">
                <img src="../assets/clement1.jpg" alt="photo de clement"/>
                <h4>Clément </h4>
            </div>
        
        </div>

        <footer>
            <h4 class="txt">Copyrigth : Cr'Hack </h4>
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

        background-color: #f7b32b;
        position : -webkit-sticky ;
        display:flex ; 
        flex-direction: row;
        flex-wrap: wrap ; 
        justify-content: space-evenly;
        align-items: center ;  
    }

    img {
        border-radius: 50%;
        width : 100px ; 
    }

    .txt{
        height: auto;
        color: #922d50;
        padding: 2%;
        margin : 2% ; 
    }

    .container {
        display:flex ; 
        flex-direction: row;
        flex-wrap: wrap ; 
        justify-content: space-evenly;
        align-items: center ; 
    }

    .student{
        /*width : 30% ; */
        /* margin : haut droit bas gauche*/
        margin : 2% 7% 2% 7% ; 
    }

    footer {
        background-color: #f7b32b;
        margin-top : 2% ; 
    }

</style>