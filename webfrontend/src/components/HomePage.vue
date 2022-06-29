<template>

        <!-- <nav class="nav">
            <img v-on:click="goToHome()" src="../assets/logo.png" alt="logo" >
            <button v-on:click="goToSignIn()" class="txt">Connexion</button>
            <button v-on:click="goToSignUp()" class="txt">Inscription</button>
        </nav>
        <router-view></router-view> -->
        <nav class="nav">
            <router-link to="/"><img src="../assets/logo.png" alt="logo"></router-link>
            <router-link to="/SignIn" class="txt">Connexion</router-link>
            <router-link to="/SignUp" class="txt">Inscription</router-link>
        </nav>

        <div class="body-white">

            <div class="txt-descr">
                <div class="section">
                    <h2>Monde/Résumé de notre projet</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis doloribus deleniti ut debitis dolor assumenda voluptatum tempora, minima accusamus quasi, illum dolores incidunt? Eius quisquam nihil ad voluptatum repellat ipsa.</p>
                </div>
                <div class="section">
                    <h2>Pourquoi-nous ?/Contexte de notre projet</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur suscipit reprehenderit, nisi impedit totam temporibus accusamus voluptatem repellendus perferendis odit? Pariatur recusandae nisi totam labore commodi aut assumenda beatae aspernatur?</p>
                </div>
                <div class="section">
                    <h2>Qui sommes-nous ? </h2>
                     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus tenetur eius aliquid officia rem vel, eaque dolor reprehenderit dicta voluptatem laudantium ea, voluptatibus accusamus excepturi architecto id culpa esse blanditiis?</p>
                </div>
            </div>

            
            <div class="container">
                <div class="student Myriam" >
                    <img src="../assets/myriam1.jpg" alt="photo de myriam"/>
                    <h4>Myriam Amor</h4>
                </div>

                <div class="student Josephine">
                    <img src="../assets/josephine2.png" alt="photo de josephine"/>
                    <h4>Joséphine de Lestrange</h4>
                </div>

                <div class="student Antoine">
                    <img src="../assets/antoine.png" alt="photo d antoine"/>
                    <h4>Antoine Gay</h4>
                </div>
                
                <div class="student Helene">
                    <img src="../assets/helene1.png" alt="photo d helene"/>
                    <h4>Helene Huang</h4>
                </div>
                
                <div class="student Ari">
                    <img src="../assets/ari1.jpg" alt="photo d ari"/>
                    <h4>Ariprakash Ranganadin</h4>
                </div>
                
                <div class="student Clément">
                    <img src="../assets/clement1.jpg" alt="photo de clement"/>
                    <h4>Clément Rostagni</h4>
                </div>
            
            </div>

        </div>

       

</template>

<script>
//import SignInVue from './SignIn.vue'
//import SignUpVue from './SignUp.vue'

export default {
    name : 'HomePage',
    setup(){

    }, 
    data(){
        /*return {
            v : false
        }*/
    }, 
    methods : {

        goToSignIn : function (){
            alert("changement de page") 
            this.$router.push({name : 'SignIn'})
        }, 

        goToSignUp : function (){
            alert("changement de page") 
            this.$router.push({name : 'SignUp'})
        }, 

        goToHome : function (){
            alert("changement de page") 
            this.$router.push({name : 'HomePage'})
        }
    }

}
</script>

<style>

    h2{
        color : #2E86AB
    }

    .body-white {
        padding : 2% ; 
    }

    .section {
        margin : 3% 0% 3% 0% ; 
    }

    .txt{
        /* for the button of nav bar */
        height: auto;
        background: #922d50;
        padding: 2%;
        margin : 2% ; 
        outline: none;
        border-radius: 30px;
        color: #FFF;
        cursor: pointer;
        transition: .3s;
    }


    .container {
        display:flex ; 
        flex-direction: row;
        flex-wrap: wrap ; 
        justify-content: space-evenly;
        align-items: center ; 
    }

    .student{
        /* haut droite bas gauche */ 
        margin : 2% 7% 2% 7% ; 
    }

  


</style>