<template>
    <nav-bar-home/>
    <div class="body-white">
        <div class="txt-descr">
            <div class="section">
                <h2>Monde/Résumé de notre projet</h2>
                <p>Salut. Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis doloribus deleniti ut debitis dolor assumenda voluptatum tempora, minima accusamus quasi, illum dolores incidunt? Eius quisquam nihil ad voluptatum repellat ipsa.</p>
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
import NavBarHome from "./navBarHomePage/NavBarHome.vue"

export default {
    name : 'HomePage',
    components:{
        NavBarHome
    },
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

<style scoped>
    h2{
        color : #2E86AB
    }

    .body-white {
        padding : 2% ; 
    }

    .section {
        margin : 3% 0% 3% 0% ; 
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