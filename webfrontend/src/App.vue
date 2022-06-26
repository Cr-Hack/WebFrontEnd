<template>
        
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
    //HomePage, 
  }
}
</script>

<style>
  #app {
    font-family:  "Segoe UI", sans-serif;
    /*-webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale; */
    text-align: center;
    color: #2c3e50;
  }

    :root{
      --yellow: #F7B32B;
      --blue: #2E86AB;
      --red: #922D50;
      font-family: "Segoe UI", sans-serif;
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

    a {
        text-decoration: none;
        color:black;
    }

</style>
