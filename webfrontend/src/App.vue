<template>
<div id="app">
    <NavBar/>
</div>

</template>

<script>
import NavBar from './views/sidebar/NavBar.vue'

export default {
  components: { NavBar },
  name: 'App',
  data(){
    return {
      
    }
  },

}
</script>

<style>


:root{
  --yellow: #F7B32B;
  --blue: #2E86AB;
  --red: #922D50;
  font-family: "Segoe UI", sans-serif;
}
#app {
  font-family: "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

a {
  text-decoration: none;
  color:black;
}

</style>
