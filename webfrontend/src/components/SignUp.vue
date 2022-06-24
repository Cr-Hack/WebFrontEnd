<template>
    
        <h2>
            ceci est la page pour s'inscrire. 
        </h2>


        <div class="container3">
            <form action="" method="post" >
                <div class="input-group">
                    <input class="field" type="text" placeholder="Prénom" required>
                </div>
                <div class="input-group">
                    <input class="field" type="text" placeholder="Nom" required>
                </div>
                <div class="input-group">
                    <input class="field" type="email" name="" id="" placeholder="Email" required>
                </div>
                <div class="input-group">
                    <input class="field" type="password" name="" id="" placeholder="Mot de passe" required>
                </div>
                <div class="input-group">
                    <input class="field" type="password" name="" id="" placeholder="Confirmation du mot de passe" required>
                </div>
                <div class="input-group-btn">
                    <button v-on:click="goToSignIn()" class="btn" type="submit">C'est parti ! </button>
                </div>
                <div class="input-group-btn">
                    <button class="btn" type="reset">Reset</button>
                </div>
                
            </form>
        </div>

    
</template>

<script>
export default {
    name : "SignUp", 
    setup(){

    }, 
    data(){

    }, 
    methods :{

        // redirection to the signin page when sign up 
        goToSignIn : function(){
            alert("Inscription réussie") 
            this.$router.push({name : 'SignIn'})
        }
    }
}
</script>

<style>


</style>