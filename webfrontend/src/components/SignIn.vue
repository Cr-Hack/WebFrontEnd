<template>
    <div>
        <nav class="nav">
            <router-link to="/"><img class="img2" src="../assets/logo.png" alt="logo"></router-link>
        </nav>

        <h2>
            ceci est la page pour se connecter. 
        </h2>


            <form class="container3" action="" method="post" @submit.prevent="goToMainPage">

                <input class="input-group" v-model="email" type="email" name="email" id="" placeholder="Email" required="required">
                
                <input class="input-group" v-model="pwd" type="password" name="pwd" id="" placeholder="Mot de passe" required="required">
        
                <button class="input-group-btn btn" type="submit">Se connecter</button>
            </form>
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
                    // send infos to the server 
                    let result = await axios.post("http://localhost:5000/auth/login", data)
                    //alert ("Connexion réussie !")
                    // modify the token 
                    this.$store.dispatch("setToken", result.data.token);
                    this.$store.dispatch("addUser", {
                        email: this.email,
                        publicKey: result.data.publicKey,
                        privateKey: result.data.privateKey,
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
        margin : 0 auto ; 
        display : flex ; 
        flex-direction: column;
        justify-content: center;
    }

    .container3 .input-group {
        width: 75%;
        height: 100%;
        border: 2px solid #2e86ab;
        padding: 20px 20px;
        font-size: 1rem;
        border-radius: 30px;
        transition: .3s;
        margin-right: auto;
        margin-left: auto;
        margin-bottom: 2%;
        
    }

    .container3 .input-group :focus,
    .container3 .input-group :valid {
        border-color: #2e86ab;
    }

    .container3 .input-group-btn  {


        display: block;
        width: 50%;
        height: 50px;
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
        margin-right: auto;
        margin-left: auto;
    }

    .container3 .input-group-btn:hover {
        transform: translateY(-5px);
        background: #266e8d;
    }

    .img2{
        margin: 2%;
    }


</style>