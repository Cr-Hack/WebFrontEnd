<template>
    <div>
        <nav class="nav">
            <router-link to="/"><img class="img2" src="../assets/logo.png" alt="logo"></router-link>
        </nav>

        <h2>
            ceci est la page pour se connecter. 
        </h2>

        <div class="container3">
            <form action="" method="post" @submit.prevent="goToMainPage">

                <div class="input-group">
                    <input v-model="email" type="email" name="email" id="" placeholder="Email" required="required">
                </div>
                <div class="input-group">
                    <input v-model="pwd" type="password" name="pwd" id="" placeholder="Mot de passe" required="required">
                </div>
                <div class="input-group-btn">
                    <button class="btn" type="submit">Se connecter</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

// :class="{'button--disabled': InvalidFields()}"
export default {
    name : "SignIn", 
    setup(){

    }, 
    data(){
        return {
            email : "", 
            pwd : "", 
        }
    },
    computed : {

    }, 
    methods :{
        goToMainPage : async function (){
            // check if the email and password are in the database 
            if (this.email != "" && this.pwd != ""){
                let data = {
                    email: this.email,
                    hashpassword: this.pwd
                }
                try{
                    let result = await axios.post("http://localhost:5000/auth/login", data)
                    //alert ("Connexion réussie !")
                    this.$store.dispatch("setToken", result.data.token);
                    this.$store.dispatch("addUser", {
                        email: this.email,
                        publicKey: result.data.publicKey,
                        privateKey: result.data.privateKey,
                        pwd: this.pwd,
                        iv: result.data.iv,
                        salt: result.data.salt
                    });
                    this.$router.push({ name: 'Main Page' })
                }catch(error){
                    console.log(error)
                    if(error.response.data.error) alert(error.response.data.error)
                }
            }
            else {
                // 
                alert ("Erreur !")     
            }   
        },

        goToHome : function (){
            alert("changement de page") 
            this.$router.push({name : 'HomePage'})
        }       
    }

}
</script>

<style scoped>


    .container3{
        padding : 2% ;
    }

    .container3 .input-group {
        width: 75%;
        height: 50px; 
        margin-bottom: 5%;
    }

    .container3 .input-group input {
        width: 100%;
        height: 100%;
        border: 2px solid #2e86ab;
        padding: 15px 20px;
        font-size: 1rem;
        border-radius: 30px;
        transition: .3s;
    }

    .container3 .input-group input:focus,
    .container3 .input-group input:valid {
        border-color: #2e86ab;
    }

    .container3 .input-group-btn{
        height: 50px;
        margin-bottom: 3%;
    }

    .container3 .input-group-btn .btn {
        display: block;
        width: 50%;
        padding: 2% 2%;
        text-align: center;
        border: none;
        background: #2e86ab;
        outline: none;
        border-radius: 30px;
        font-size: 1.2rem;
        color: #FFF;
        cursor: pointer;
        transition: .3s;
        margin-bottom: 3%;
    }

    .container3 .input-group-btn .btn:hover {
        transform: translateY(-5px);
        background: #266e8d;
    }

    .img2{
        margin: 2%;
    }


</style>