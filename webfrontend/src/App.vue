<template>
        <nav class="nav">

            <router-link to="/"><img src="./assets/logo.png" alt="logo"></router-link>
            <router-link to="/SignIn" class="txt">Connexion</router-link>
            <router-link to="/SignUp" class="txt">Inscription</router-link>

        </nav>
        <router-view></router-view>

        <footer>
            <h4 class="txt-footer">Copyrigth : Cr'Hack </h4>
        </footer>
</template>

<script>
//import HomePage from './components/HomePage.vue'


export default {
  name: 'App',
  components: {
   
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    /*-webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale; */
    text-align: center;
    color: #2c3e50;
  }

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

    
    footer {
        background-color: #f7b32b ; 
    }

    .txt-footer{
        height: auto;
        color: #922d50;
        padding: 2%;
        margin : 0% ; 
    }

</style>
