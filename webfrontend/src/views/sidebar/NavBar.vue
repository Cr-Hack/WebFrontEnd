<template>
<nav>
    <div class="container-rightSide"> 
        <i id="account" class="fa-solid fa-user"></i>
        <p>{{user_name}}</p>
    </div>
    
    <div id="resp-menu">
        <i class="fa-solid fa-bars"></i>
    </div>
    <div class="nav_link">
        <router-link to="/MainPage">Guide</router-link>
        <router-link to="/seefile">Afficher</router-link>
        <router-link to="/sendfile">Envoyer un fichier</router-link>
        <router-link to="/"><i class="fa-solid fa-arrow-right-from-bracket"></i></router-link>
    </div>

</nav>
<router-view/>

</template>

<script>
export default {
    data(){
        return{
            user_name : ''
        }
    },

    methods:{
        getUser: async function(){
            this.user_name = this.$store.getters.user.first_name
            console.log(this.user_name)
        }
    },
    beforeMount(){
        this.getUser()
    }
}
</script>

<style scoped>

nav{
    display: flex;
    flex: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    background-color: var(--yellow);
    height: auto;
}

img{
    width: 100px;
}

.container-rightSide{
    width: 200px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

#resp-menu{
    display: none;
}

#account{
    margin: auto auto;
}

.nav_link{
    width: 350px;
    display: flex;
    flex: wrap;
    justify-content: space-evenly;
    font-size: 1em;
    font-weight: 300;
}

.nav_link > a {
    color: black;
    padding: .75em;
    text-align: center;
    text-decoration: none;
    transition: all .3s;
}

.nav_link > a:hover{
    font-weight: bold;
    color: var(--red);
}

#logout:hover, #title:hover{
    font-weight: bold;
    color: var(--blue); 
    transition: all .3s;
}

.router-link-active{
    border-bottom: 1px solid var(--red);
}

@media all and (max-width: 500px){
    #resp-menu{
        display: block;
    }
    .nav_link{
        position: relative;
        flex-direction: column;
    }
    nav{
        flex-direction: column;
    }
}
</style>