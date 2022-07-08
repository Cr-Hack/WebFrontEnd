<template>
    <nav class="nav">
        <div class="container-nav-links">
            <router-link to="/SignIn" class="txt">Connexion</router-link>
            <router-link to="/SignUp" class="txt">Inscription</router-link>
        </div>
    </nav>
    <router-view/>
</template>

<script>
export default {

}
</script>

<style scoped>
.nav{
    position: fixed;
    top: 0;
    width: 100%;
}
.container-nav-links{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
}


.txt{
    flex: 1;
    padding: 10px;
    color: var(--red);
    transition:  0.3s ease;
}

.txt:hover{
    background-color: var(--red);
    color: #fff;
    transition:  0.3s ease;
}

</style>