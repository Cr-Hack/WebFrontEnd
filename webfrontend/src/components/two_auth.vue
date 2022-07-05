<template>
    <div>
        <nav class="nav">
                <router-link to="/"><img class="img2" src="../assets/logo.png" alt="logo"></router-link>
            </nav>

            <h2>
                Entrer le code d'authentification envoyé par mail 
            </h2>

            <!--<form class="container3" action="" method="post" @submit.prevent="sendEmailAuth">
                <input class="input-group" v-model="email" type="email" name="email" id="" placeholder="Email" required="required">
                <button class="input-group-btn btn" type="submit">Envoyer</button>
            </form> --> 

            <form action="container3" method="post" @submit.prevent="verify_auth()">
                <input class="input-group" type="number" v-model="code_auth" min="0" max="1000000" required>
                <button class="input-group-btn btn" type="submit">Envoyer</button>
            </form>
            
    </div>
        
</template>

<script>
import emailjs from 'emailjs-com';

export default {

    name : "two_auth", 
    setup(){

    }, 
    data (){
        return {
            email : "", 
            code_auth: "", 
            code_send : "", 
            count : 3 
        }
    }, 

    mounted() {
        //console.log("coucou")
        // send the email of double auth 
            this.code_send = this.generateCode()

            var templateParams = {
                name_to: "myriam",
                email: "myriam.amor@efrei.net", //this.$store.getters.user.email, 
                code : this.code_send
            }
            
            emailjs.send('service_inoyguh', 'template_hz9d0bi', templateParams, '-8WVggmuaOEK7xqrr')
                .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                }, function(error) {
                console.log('FAILED...', error);
            });
        
    }, 
    methods : {

        goToHome : function (){
            alert("changement de page") 
            this.$router.push({name : 'Main Page'})
        }, 

        sendEmailInsc() {

            var templateParams = {
                name_to: "myriam",
                email: this.email,
                //message: this.message, 
            }
            
            emailjs.send('service_inoyguh', 'template_0uivapo', templateParams, '-8WVggmuaOEK7xqrr')
                .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                }, function(error) {
                console.log('FAILED...', error);
            });
        },

        generateCode : function (){
            let code2 = Math.floor(Math.random() * 1000000)
            return code2 
        }, 


        verify_auth : function (){

            if (this.code_auth == this.code_send ) {
                alert ("connexion réussie ! ")
                this.$router.push({ name: 'Main Page' })
            }
            else {
                if (this.count <= 0){
                    alert ("Vous n'avez plus d'essais ")
                    this.$router.push({ name: 'SignIn' })
                }
                else {
                    alert ("le code n'est pas bon ! Il vous reste "+ this.count +" essais" )
                    this.count -- 
                }
                
            }
        }, 

    }

}
</script>

<style>

    
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