<template>
<nav>
    <div>
        <a href="https://8.8.8.8/" id="title">Cr'Hack Share</a>
    </div>
    <div class="nav_link">
        <router-link to="/">Guide</router-link>
        <router-link to="/seefile">Afficher</router-link>
        <router-link to="/sendfile">Envoyer un fichier</router-link>
    </div>
    <a href="https://www.google.com/" id="logout">Se deconnecter</a>
</nav>
<router-view/>

</template>

<script>
export default {

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
}



.nav_link{
    width: 350px;
    display: flex;
    flex-direction: row;
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

</style>