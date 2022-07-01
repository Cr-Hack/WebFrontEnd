<template>
    <div>
        <nav class="nav">
            <router-link to="/"><img class="img2" src="../assets/logo.png" alt="logo"></router-link>
        </nav>


        <h2>
            Inscription
        </h2>


        <div class="container3">
            <form action="" method="post" @submit.prevent="goToSignIn()">
                <div class="input-group">
                    <input v-model="fname" class="field" type="text" placeholder="Prénom" required>
                </div>
                <div class="input-group">
                    <input v-model="lname" class="field" type="text" placeholder="Nom" required>
                </div>
                <div class="input-group">
                    <input v-model="email" class="field" type="email" name="" id="email" placeholder="Email" required>
                </div>
                <div class="input-group">
                    <input v-model="pwd" class="field" type="password" name="" id="pwd" placeholder="Mot de passe"
                        required>
                </div>
                <div class="input-group">
                    <input v-model="pwd_verif" class="field" type="password" name="" id="pwd_verif"
                        placeholder="Confirmation du mot de passe" required>
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
            console.log(keyPair)
            console.log(keyPair.privateKey)
            console.log(keyPair.publicKey)
            console.log("avant exportation");
            // export the CryptoKeys above into ArrayBuffers
            let rsaPrivate = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);  // object of type ArrayBuffer
            let rsaPublic = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);  // object of type ArrayBuffer

            console.log("ici before encryption (en arraybuffer)");
            console.log(rsaPrivate);
            console.log("longeur private key " + rsaPrivate.byteLength)
            console.log(rsaPublic);
            console.log("longeur public key " + rsaPublic.byteLength)

            /***** RSA private key encryption *****/
            const user_salt = window.crypto.getRandomValues(new ArrayBuffer(16));  // salt generation - why arrayBuffer(16) ??? TBD 
            const init_vector = window.crypto.getRandomValues(new ArrayBuffer(12))  // initialisation vector generation
            const rsaEncryptedPrivateKey = await this.encryptRsaKey(this.pwd_verif, rsaPrivate, init_vector, user_salt);  // encryption
            console.log("this is the encrypted private rsa key: ")
            console.log(rsaEncryptedPrivateKey)
            console.log("private key encrypted arraybuffer")
            console.log(rsaEncryptedPrivateKey.byteLength)


            /***** RSA private and public keys from type ArrayBuffer to String *****/
            const rsaEncPrivKeyStr = this.arrayBufferToStr(rsaEncryptedPrivateKey);
            const rsaPublicStr = this.arrayBufferToStr(rsaPublic);

            console.log("DANS VUE.JS")
            console.log("the private key in string")
            console.log(rsaEncPrivKeyStr)

            console.log("back to the array buffer")
            let back2ab = this.strToArrayBuffer(rsaEncPrivKeyStr)
            console.log(back2ab)

            let stringagain = this.arrayBufferToStr(back2ab)

            console.log("are they the same? ")
            console.log(rsaEncPrivKeyStr === stringagain)

            console.log("after conversion to string");
            console.log(rsaEncPrivKeyStr);
            console.log("longeur private key " + rsaEncPrivKeyStr.length)
            console.log(rsaPublicStr);
            console.log("longeur public key " + rsaPublicStr.length)

            /***** elements to send the server *****/
            var toServer = {
                first_name: this.fname,
                last_name: this.lname,
                email: this.email,
                hashpassword: this.pwd,//    mdp à hasher
                privatekey: rsaEncPrivKeyStr,
                publickey: rsaPublicStr,
                iv: this.arrayBufferToStr(init_vector), 
                salt: this.arrayBufferToStr(user_salt),
            }

            try {
                let response = await axios.post('http://localhost:5000/auth/register', toServer)
                console.log(response);
                alert("Inscription réussie")
                this.$router.push({ name: 'SignIn' })
            } catch (error) {
                console.log(error);
                if(error.response.data.error) alert(error.response.data.error)
            }

            
            /*if (this.pwd != this.pwd_verif){
                    alert ("Les champs de mot de passe sont différents ")
                }
                else {
                    alert("Inscription réussie") 
                    this.$router.push({name : 'SignIn'})  
                }*/
        },

        // RSA key generation
        rsaKeyPair: async function () {
            var keyPair = await window.crypto.subtle.generateKey(
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
            
            return keyPair

        },

        arrayBufferToStr: function (arrayBuf) {
            return String.fromCharCode.apply(null, new Uint8Array(arrayBuf));
        },

        strToArrayBuffer: function (str) {
            const buf = new ArrayBuffer(str.length);
            const bufView = new Uint8Array(buf);
            for (let i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        },
        

        // AES-GCM-256 encryption algorithm (to encrypt the RSA private key)

        /***** AES-GCM-256 KEY GENERATION *****/

        // the AES "key material"
        aesKeyMaterial: async function (userPassword) {
            let pwdVerif = userPassword;
            let enc = new TextEncoder();
            return await window.crypto.subtle.importKey(  // WTF is that ???
                "raw",
                enc.encode(pwdVerif),
                "PBKDF2",
                false,
                ["deriveBits", "deriveKey"]
            );
        },

        // the actuall AES key
        aesKey: async function (keyMaterial, user_salt) {
            let symKey = await window.crypto.subtle.deriveKey( // a promise then an ArrayBuffer when it is fulfiled
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
            return symKey;
        },


        /***** AES-GCM-256 ENCRYPTION *****/

        // the RSA private key will be generated and its type is an arrayBuffer as well

        // encryption function 
        // encryption function 
        encryptRsaKey: async function(userPassword, rsaPrivateKeyPlain, initVector, userSalt) {
            // // encoding of the plaintext so that the format is correct
            // let enc = new TextEncoder();
            // var plaintext = enc.encode(rsaPrivateKeyPlain);
            // console.log(plaintext);

            // AES key
            let keyMaterial = await this.aesKeyMaterial(userPassword);
            var key = await this.aesKey(keyMaterial, userSalt);  // var or let ? not sure...

            // encryption of the plaintext here
            let ciphertext = await window.crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: initVector,
                    tagLength: 128 // cf documentation to see the allowed lengths
                },
                key,
                rsaPrivateKeyPlain // data to cipher
            ); // return an ArrayBuffer
            
            return ciphertext;

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