<template>
    <div>
        <nav class="nav">
            <router-link to="/"><img class="img2" src="../assets/logo.png" alt="logo"></router-link>
        </nav>

        <h2>
            ceci est la page pour s'inscrire. 
        </h2>


        <div class="container3">
            <form action="" method="post" @submit.prevent="goToSignIn">
                <div class="input-group">
                    <input v-model="fname" class="field" type="text" placeholder="Prénom" required>
                </div>
                <div class="input-group">
                    <input v-model="lname" class="field" type="text" placeholder="Nom" required>
                </div>
                <div class="input-group">
                    <input v-model="email" class="field" type="email" name="" id="" placeholder="Email" required>
                </div>
                <div class="input-group">
                    <input v-model="pwd" class="field" type="password" name="" id="" placeholder="Mot de passe" required>
                </div>
                <div class="input-group">
                    <input v-model="pwd_verif" class="field" type="password" name="" id="" placeholder="Confirmation du mot de passe" required>
                </div>
                <div class="input-group-btn">
                    <button class="btn" type="submit">C'est parti ! </button>
                </div>
                <div class="input-group-btn">
                    <button class="btn" type="reset">Reset</button>
                </div>
                
            </form>
        </div>
    </div>
    
</template>

<script>
export default {
    name : "SignUp", 
    setup(){

    }, 
    data(){
        return {
            fname : "", 
            lname :"", 
            email : "", 
            pwd : "", 
            pwd_verif:"", 
        }

    }, 
    methods :{

        // redirection to the signin page when sign up 
        goToSignIn : function(){

                // check if the 2 passwords are the same 
                if (this.pwd != this.pwd_verif){
                    alert ("Les champs de mot de passe sont différents ")
                }
                else {
                    alert("Inscription réussie") 
                    this.$router.push({name : 'SignIn'})  
                }
        }, 

        goToHome : function (){
            alert("changement de page") 
            this.$router.push({name : 'HomePage'})
        }   
    }
}
</script>

<style>


</style>