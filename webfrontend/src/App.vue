<template>
<div id="app">
    <nav>
        <router-link to="/">Accueil</router-link> |
        <router-link to="/seefile">See the files</router-link> |
        <router-link to="/sendfile">Send files</router-link>
    </nav>
    <router-view/>
</div>

</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      
    }
  },
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

a {
  text-decoration: none;
  color: #C1C1C1;
}

.router-link-active{
  font-weight: bold;
  color: #922D50;
}
</style>
