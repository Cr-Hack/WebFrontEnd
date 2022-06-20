<template>
    
        <h2>
            ceci est la page pour s'inscrire. 
        </h2>
        <div >
            <form action="post" class="container2">

                <input class="field" type="text" placeholder="Prénom" required>

                <input class="field" type="text" placeholder="Nom" required>

                <input class="field" type="email" name="" id="" placeholder="Email" required>

                <input class="field" type="password" name="" id="" placeholder="Mot de passe" required>

                <input class="field" type="password" name="" id="" placeholder="Confirmation du mot de passe" required>

                <button type="submit">C'est parti ! </button>
                <button type="reset">Reset</button>

            </form>
        </div>

    
</template>

<script>
export default {
    name : "SignUp", 
    setup(){

    }, 
    data(){

    }
}
</script>

<style>

.container2 {
    display:flex ; 
    flex-direction: column;
}

.field {
    border-radius: 20%;
    size : 100px ; 
}


</style>