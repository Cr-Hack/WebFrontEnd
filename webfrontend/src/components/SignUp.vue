<template>
    <div>
        <h2>
            ceci est la page pour s'inscrire.
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
            // the salt (other half of the AES key that will be stored in the database) - to be sent to the server as well
            user_salt: window.crypto.getRandomValues(new Uint8Array(16)),  // why Uint8Array(16) ??? TBD 
            // the initialisation vector
            init_vector: window.crypto.getRandomValues(new Uint8Array(12))
        }
    }, 
    methods :{
        // redirection to the signin page when sign up 


        goToSignIn: async function () {
            /* RSA key generation */
            var keyPair = await this.rsaKeyPair();
            console.log(keyPair)

            var rsaPrivate = keyPair.privateKey;
            var rsaPublic = keyPair.publicKey;

            console.log("this is the rsa private key: " + rsaPrivate)
            console.log("this is the rsa public key: " + rsaPublic)

            /* RSA private key encryption */
            this.encryptRsaKey(this.pwdVerif, rsaPrivate, this.init_vector, this.user_salt, (rsaEncryptedPrivateKey) => {
                console.log("this is the encrypted private rsa key: " + rsaEncryptedPrivateKey)

                /* elements to send the server */
                var toServer = {
                    first_name: this.lname,
                    last_name: this.lname,
                    hashpassword: "mdp à hasher",
                    publickey: rsaPublic,
                    privatekey: rsaEncryptedPrivateKey,
                    iv: this.init_vector, 
                    salt: this.user_salt
                }

                axios.post('localhost:5050/auth/register', toServer)
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                // jsp comment on fait pour envoyer ça au serveur ?

                alert("Inscription réussie")
                this.$router.push({ name: 'SignIn' })
            })
        },

        // version 2
                // goToSignIn: function(){
        //     /* RSA key generation */
        //     this.rsaKeyPair().then((keyPair) => {
        //         var rsaPrivate = this.rsaPrivateKey(keyPair);
        //         var rsaPublic = this.rsaPublicKey(keyPair);
        //         console.log("this is the rsa private key: " + rsaPrivate)
        //         console.log("this is the rsa public key: " + rsaPublic)

        //         /* RSA private key encryption */
        //         this.encryptRsaKey(this.pwdVerif, rsaPrivate, this.init_vector, this.user_salt, (rsaEncryptedPrivateKey) => {
        //             console.log("this is the encrypted private rsa key: " + rsaEncryptedPrivateKey)

        //             /* elements to send the server */
        //             // var toServer = {
        //             //     first_name: this.lname,
        //             //     last_name: this.lname,
        //             //     hashpassword: "mdp à hasher",
        //             //     publickey: rsaPublic,
        //             //     privatekey: rsaEncryptedPrivateKey,
        //             //     iv: this.init_vector, 
        //             //     salt: this.user_salt
        //             // }
        //             // jsp comment on fait pour envoyer ça au serveur ?

        //             alert("Inscription réussie")
        //             this.$router.push({ name: 'SignIn' })
        //         })
        //     });
        // },


        // RSA key generation
        rsaKeyPair: function () {
            return window.crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    // Consider using a 4096-bit key for systems that require long-term security
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),  // WHY those arguments?? to be determined 
                    hash: "SHA-256",
                },
                true,
                ["encrypt", "decrypt"]
            )  // the return type is a promise that is an ArrayBuffer
        },


        // AES-GCM-256 encryption algorithm (to encrypt the RSA private key)

        /***** AES-GCM-256 KEY GENERATION *****/

        // the AES "key material"
        aesKeyMaterial: function (userPassword) {
            let pwdVerif = userPassword;
            let enc = new TextEncoder();
            return window.crypto.subtle.importKey(  // WTF is that ???
                "raw",
                enc.encode(pwdVerif),
                "PBKDF2",
                false,
                ["deriveBits", "deriveKey"]
            );
        },

        // the actuall AES key
        aesKey: function (keyMaterial) {
            return window.crypto.subtle.deriveKey(
                {
                    "name": "PBKDF2",
                    salt: this.user_salt,
                    "iterations": 100000,
                    "hash": "SHA-256"
                },
                keyMaterial,
                { "name": "AES-GCM", "length": 256 }, // so the key length will be 256
                true,
                ["encrypt", "decrypt"]
            );
        },


        /***** AES-GCM-256 ENCRYPTION *****/

        // the RSA private key will be generated and its type is an arrayBuffer as well

        // encryption function 
        // encryption function 
        encryptRsaKey: async function(userPassword, rsaPrivateKeyPlain, initVector, userSalt, callBack) {
            // encoding of the plaintext so that the format is correct
            let enc = new TextEncoder();
            var plaintext = enc.encode(rsaPrivateKeyPlain);
            console.log(plaintext);

            // AES key and IV
            let keyMaterial = await this.aesKeyMaterial(userPassword);
            var key = await this.aesKey(keyMaterial, userSalt);  // var or let ? not sure...

            // encryption of the plaintext here
            window.crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: initVector,
                    tagLength: 128 // cf documentation to see the allowed lengths
                },
                key,
                plaintext // data to cipher
            ).then((ciphertext) => {
                    // // let's display the ciphertext in a "readable" way
                    // let ciphertextUnit = new Uint8Array(ciphertext, 0, 5);  // why 5??
                    // let dec = new TextDecoder();
                    // let ciphertextString = dec.decode(ciphertextUnit);
                    // console.log(ciphertextString);
                    // // CA MARCHE PAS ENCORE, IL VA FALLOIR TROUVER UNE FACON DE DISPLAY CE TRUC
                    // console.log(typeof (ciphertext));
                    callBack(ciphertext);  // return ciphertext (the encrypted RSA key which is a Promise that fulfills with an [ArrayBuffer] containing the ciphertext)
                }
            )
        }
    }
}
</script>

<style>


</style>