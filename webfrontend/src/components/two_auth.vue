<template>
    <div>
        <nav class="nav">
                <router-link to="/"><img class="img2" src="../assets/logo.png" alt="logo"></router-link>
            </nav>

            <h2>
                Entrer le code d'authentification envoyé par mail 
            </h2>

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
            //const hash_code_send = await this.hashencryption(this.code_send) ; 
            
            var templateParams = {
                email: this.$store.getters.user.email, 
                code : this.code_send
            }
            
            emailjs.send('service_inoyguh', 'template_hz9d0bi', templateParams, '-8WVggmuaOEK7xqrr')
                .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                }, function(error) {
                console.log('FAILED...', error);
            })

            // send to the signin page when the code was given for more than 1000 millisecondes
            setTimeout(() => {
                this.$router.push({ name: 'SignIn' })
            }, 1000) 

        
    },
    methods : {

        goToHome : function (){
            alert("changement de page") 
            this.$router.push({name : 'Main Page'})
        }, 

        generateCode : function (){
            let code2 = Math.floor(Math.random() * 1000000)
            return code2 
        }, 

        /*hashencryption : async function (message1){

            const msgUint8_1 = new TextEncoder().encode(message1);                           // encode as (utf-8) Uint8Array
            const hashBuffer_1 = await crypto.subtle.digest('SHA-256', msgUint8_1);           // hash the message
            const hashArray_1 = Array.from(new Uint8Array(hashBuffer_1));                     // convert buffer to byte array
            const hashHex_1 = hashArray_1.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
            console.log(hashHex_1);
            return hashHex_1 ;
        }, */

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