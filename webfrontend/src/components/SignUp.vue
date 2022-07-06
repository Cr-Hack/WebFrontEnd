<template>
    <div>
        <nav class="nav">
            <router-link to="/"><img class="img2" src="../assets/logo.png" alt="logo"></router-link>
        </nav>


        <h2>
            Inscription
        </h2>

        <form class="container3" action="" method="post" @submit.prevent="goToSignIn()">

            <input class="input-group" v-model="fname" type="text" placeholder="Prénom" required>
            <input class="input-group" v-model="lname" type="text" placeholder="Nom" required>
            <input class="input-group" v-model="email" type="email" name="" id="email" placeholder="Email" required>
            <input class="input-group" v-model="pwd" type="password" name="" id="pwd" placeholder="Mot de passe"
                required>
            <input class="input-group" v-model="pwd_verif" type="password" name="" id="pwd_verif"
                placeholder="Confirmation du mot de passe" required>
            <button class="input-group-btn" type="submit">C'est parti !</button>
            <button class="input-group-btn" type="reset">Reset</button>

        </form>
        <!--button class="input-group-btn" type="" @click="testfunc()">Test</button-->
    </div>
</template>

<script>

//import emailjs from 'emailjs-com';
const axios = require('axios')

export default {
    name : "SignUp", 
    setup(){

    }, 
    data() {
        return {
            fname: '',
            lname: '',
            email: '',
            pwd: '',
            pwd_verif: '',
        }
    }, 
    methods :{
        // redirection to the signin page when sign up 

        goToHome : function (){
            alert("changement de page") 
            this.$router.push({name : 'HomePage'})
        }, 
        
        goToSignIn: async function () {
            /***** RSA key generation *****/
            var keyPair = await this.rsaKeyPair();

            // export the CryptoKeys above into ArrayBuffers
            let rsaPrivate = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);  // object of type ArrayBuffer
            console.log("private kye here !!!!!!!!!!!!!!")
            console.log(this.arrayBufferToBase64(rsaPrivate))
            let rsaPublic = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);  // object of type ArrayBuffer

            /***** RSA private key encryption *****/
            // construction of the AES sym key
            const user_salt = window.crypto.getRandomValues(new Uint8Array(16));  // salt generation - why arrayBuffer(16) ??? TBD 
            const init_vector = window.crypto.getRandomValues(new Uint8Array(12))  // initialisation vector generation
            const keyMaterial = await this.aesKeyMaterial(this.pwd)
            const aesEncKey = await this.aesKey(keyMaterial, user_salt)

            ////////////// test zone 
            console.log("the AES encryption key converted to str")
            const aeskeyAB = await window.crypto.subtle.exportKey("raw", aesEncKey)
            const aeskeystr = this.arrayBufferToBase64(aeskeyAB)
            console.log(aeskeystr)

            // actual encryption
            const rsaEncryptedPrivateKey = await this.encryptRsaKey(rsaPrivate, init_vector, aesEncKey);  // encryption

            /***** RSA private and public keys from type ArrayBuffer to String *****/
            const rsaEncPrivKeyStr = this.arrayBufferToBase64(rsaEncryptedPrivateKey);
            const rsaPublicStr = this.arrayBufferToBase64(rsaPublic);


            // hash of password 
            const hashpwd = await this.hashencryption(this.pwd) ;  

            /***** elements to send the server *****/
            var toServer = {
                first_name: this.fname,
                last_name: this.lname,
                email: this.email,
                hashpassword: hashpwd,
                privatekey: rsaEncPrivKeyStr,
                publickey: rsaPublicStr,
                iv: this.arrayBufferToBase64(init_vector), 
                salt: this.arrayBufferToBase64(user_salt),
            }

            try {
                let response = await axios.post('http://localhost:5000/auth/register', toServer)
                console.log(response);
                alert("Inscription réussie")
                //this.sendEmailInsc()
                this.$router.push({ name: 'SignIn' })
            } catch (error) {
                console.log(error);
                if(error.response.data.error) alert(error.response.data.error)
            }

        },

        // RSA key generation
        rsaKeyPair: async function () {
            try {
                return await window.crypto.subtle.generateKey(
                    {
                        name: "RSA-OAEP",
                        // Consider using a 4096-bit key for systems that require long-term security
                        modulusLength: 2048,
                        publicExponent: new Uint8Array([1, 0, 1]),  // WHY those arguments?? to be determined 
                        hash: "SHA-256",
                    },
                    true,  // meaning that the key is extractable (it can be exported)
                    ["encrypt", "decrypt"] // key usages
                )  // the return type is a promise that is a CryptoKeyPair
            } catch (err) {
                console.log("RSA key generation failed ", err)
            }

        },

        base64ToArrayBuffer: function(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        },

        arrayBufferToBase64: function( buffer ) {
            var binary = '';
            var bytes = new Uint8Array( buffer );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            return window.btoa( binary );
        },
        

        // AES-GCM-256 encryption algorithm (to encrypt the RSA private key)

        /***** AES-GCM-256 KEY GENERATION *****/

        // the AES "key material"
        aesKeyMaterial: async function (userPassword) {
            try {
                let enc = new TextEncoder();
                return await window.crypto.subtle.importKey(  
                    "raw",
                    enc.encode(userPassword),
                    "PBKDF2",
                    false,
                    ["deriveKey"]
                );
            } catch (err) {
                console.log("User password processing failed ", err)
            }
        },

        // the actuall AES key
        aesKey: async function (keyMaterial, user_salt) {
            try {
                return await window.crypto.subtle.deriveKey( // returns a CryptoKey when the promise is fulfilled
                    {
                        "name": "PBKDF2",
                        salt: user_salt,
                        "iterations": 100000,
                        "hash": "SHA-256"
                    },
                    keyMaterial,
                    { "name": "AES-GCM", "length": 256 }, // so the key length will be 256
                    true,
                    ["encrypt", "decrypt"]
                );
            } catch (err) {
                console.log("AES key reconstruction failed ", err)
            }
        },


        /***** AES-GCM-256 ENCRYPTION *****/

        // the RSA private key will be generated and its type is an arrayBuffer as well
        // encryption function 
        encryptRsaKey: async function(rsaPrivateKeyPlain, initVector, encKey) {
            // encryption of the plaintext here
            try {
                return await window.crypto.subtle.encrypt(
                    {
                        name: "AES-GCM",
                        iv: initVector,
                        tagLength: 128 // cf documentation to see the allowed lengths
                    },
                    encKey,
                    rsaPrivateKeyPlain // data to cipher
                ); // return an ArrayBuffer
            } catch (err) {
                console.log("RSA private key encryption failed ", err)
            }
        }, 

        hashencryption : async function (message1){
            const msgUint8_1 = new TextEncoder().encode(message1);                           // encode as (utf-8) Uint8Array
            const hashBuffer_1 = await crypto.subtle.digest('SHA-256', msgUint8_1);           // hash the message
            const hashArray_1 = Array.from(new Uint8Array(hashBuffer_1));                     // convert buffer to byte array
            const hashHex_1 = hashArray_1.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
            return hashHex_1 ;
        },


        // increment: async function (initVector, id) {
        //     let strIV = this.arrayBufferToBase64(initVector)
        //     let hash = await this.hashencryption(strIV + id)
        //     return new Uint8Array(this.base64ToArrayBuffer(hash.slice(0, strIV.length)))
        // },

        // testfunc: async function () {
        //     let initVector = window.crypto.getRandomValues(new Uint8Array(12))
        //     console.log(initVector)
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(window.crypto.getRandomValues(new Uint8Array(12)))
        //     // console.log(await this.increment(initVector, 1))
        //     // console.log(await this.increment(initVector, 2))
        //     // console.log(await this.increment(initVector, 3))
        //     // console.log(await this.increment(initVector, 4))
        //     // console.log(await this.increment(initVector, 5))
        //     // console.log("repetition !!!")
        //     // console.log(await this.increment(initVector, 1))
        //     // console.log(await this.increment(initVector, 2))
        //     // console.log(await this.increment(initVector, 3))
        //     // console.log(await this.increment(initVector, 4))
        //     // console.log(await this.increment(initVector, 5))
        // }

        /*sendEmailInsc() {

            let name = this.fname + " "+ this.lname
            var templateParams = {  
                name_to: name ,
                email: this.email,
            }
            
            emailjs.send('service_inoyguh', 'template_0uivapo', templateParams, '-8WVggmuaOEK7xqrr')
                .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                }, function(error) {
                console.log('FAILED...', error);
            });
        },*/

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
        width: 200px;
        height: 50px;
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
        position : left ; 
    }

</style>