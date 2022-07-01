<template>
    <div>
        <nav-bar />
        <div class="send-box">
            <h2 id="title">Formulaire d'envoi chiffré</h2>
            <form class="formy" method="post" @submit.prevent="handleFile()">
                <div class="user-box" id="input-file">
                    <img id="file-ip-1-preview" />
                    <label for="fileInput">
                        <h3>Seléctionner votre fichier (.pdf, .jpg ou .png)</h3>
                        <i class="fa-solid fa-file-circle-plus fa-2xl"></i>
                        <input id="fileInput" type="file" required="required" @change="showPreview($event);">
                    </label>
                </div>
                <div class="user-box">
                    <input type="text" id="dest" required="required" placeholder="Destinataire">
                </div>

                <div class="btn">
                    <button type="submit" id="confirm" class="btn_l">Confirmer</button>
                    <button type="reset" id="del" class="btn_l">Annuler</button>
                </div>
            </form>

        </div>
    </div>
</template>

<script>
import NavBar from './sidebar/NavBar.vue'
const axios = require('axios')

export default {
    components : {NavBar}, 
    setup() {
        
    },
    data() {
        return {
            fileToSend: ''
        }
    }, 
    methods:{
        showPreview(event){
            if(event.target.files.length > 0){
                var src = URL.createObjectURL(event.target.files[0]);
                var preview = document.getElementById("file-ip-1-preview");
                preview.src = src;
            }
        },

        handleFile: async function () {
            //alert("j'ai cliqué sur le bouton confirmer")
            var selectedFile = document.getElementById("fileInput").files[0];  // is a complex object (blob) ? 

            console.log(selectedFile)
            console.log(typeof(selectedFile))
            console.log(selectedFile.text())

            var arrayBuf = await selectedFile.arrayBuffer()  // convert the file to an arraybuffer

            console.log("type of arrayBuff")
            console.log(typeof(arrayBuf))
            console.log(arrayBuf)

            // AES key and IV
            const symKey = this.aesKeyGeneration() // return an CryptoKey type
            const initVector = window.crypto.getRandomValues(new Uint8Array(12))  // initialisation vector generation

            // file encryption 
            var encryptedFile = this.encryptFile(arrayBuf, initVector, symKey);  // returns an ArrayBuffer


            /***** AES symmetric key encryption with the RSA public key of the receiver AND the sender *****/
            // fetch the receiver's public RSA key (type string)
            const receiverPublicKeyStr = await axios.post()
            const senderPublicKeyStr = await axios.post()

            // convert the string to ArrayBuffer
            const receiverPublicKeyAB = this.strToArrayBuf(receiverPublicKeyStr)  
            const senderPublicKeyAB = this.strToArrayBuf(senderPublicKeyStr) 

            // convert the ArrayBuffer to CryptoKey (with the importKey function)
            const receiverPubKeyCryptoKey = await this.importPubKey(receiverPublicKeyAB)  // function to implement
            const senderPubKeyCryptoKey = await this.importPubKey(senderPublicKeyAB)

            // encrypt the aes sym key with the sender and receiver public key
            const receiverEncSymKey = await this.rsaEncrypt(symKey, receiverPubKeyCryptoKey)  // returns an arraybuffer
            const senderEncSymKey = await this.rsaEncrypt(symKey, senderPubKeyCryptoKey)

            // convert the array buffers to string 
            const receiverEncSymKeyStr = this.arrayBufferToStr(receiverEncSymKey)  // to be sent to the server
            const senderEncSymKeyStr = this.arrayBufferToStr(senderEncSymKey)

            /***** init vector encryption for sender and receiver *****/
            // convert uint8array to arraybuffer
            const ivArrayBuf = this.uint8ArrayToArrayBuffer(initVector)

            // encrypt the IVs with RSA public keys
            const receiverEncIv = this.rsaEncrypt(ivArrayBuf, receiverPubKeyCryptoKey)
            const senderEncIv = this.rsaEncrypt(ivArrayBuf, senderPubKeyCryptoKey)

            const toServer = {
                file: encryptedFile,
                receiverEncSymKey: receiverEncSymKeyStr,
                senderEncSymKey: senderEncSymKeyStr,
                receiverEncInitVector: receiverEncIv,
                senderEncInitVector: senderEncIv
            }

            axios.post('', toServer)
                .then(function (response) {
                    console.log(response);
                    alert("votre fichier a bien été envoyé")
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        aesKeyGeneration: async function () {
            let key = await window.crypto.subtle.generateKey(
                {
                    name: "AES-GCM",
                    length: 256
                },
                true,
                ["encrypt", "decrypt"]
            );
            return key
        }, 

        encryptFile: async function (filePlain, initVector, symKey) {  // filePlain is the file to encrypt, (type = arraybuffer)
            let ciphertext = await window.crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: initVector,
                    tagLength: 128 // cf documentation to see the allowed lengths
                },
                symKey,
                filePlain // data to cipher
            ); // return an ArrayBuffer
            return ciphertext;
        }, 

        strToArrayBuf: function (str) {
            const buf = new ArrayBuffer(str.length);
            const bufView = new Uint8Array(buf);
            for (let i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        },

        arrayBufferToStr: function (arrayBuf) {
            return String.fromCharCode.apply(null, new Uint8Array(arrayBuf));
        },

        uint8ArrayToArrayBuffer: function (unit8array) {
            return unit8array.buffer.slice(unit8array.byteOffset, unit8array.byteLength + unit8array.byteOffset)
        },

        importPubKey: async function (keyData) {  // the type of keyData is ArrayBuffer
            let cryptoKey = await window.crypto.subtle.importKey(
                "spki", 
                keyData,
                "RSA-OAEP",
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256"  // WHY this ??? TBD
                },
                true,
                ["encrypt"]
            )
            return cryptoKey
        },

        rsaEncrypt:async function (aesKeyOrIvPlain, rsaPublicKey) {
            let ciphertext = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP"
                },
                rsaPublicKey,
                aesKeyOrIvPlain  // data to encrypt
            );
            return ciphertext
        }
    }        
}
</script>

<style scoped>

#file-ip-1-preview{
    border-radius: 0;
    margin: 0 auto;
    margin-bottom: 10px;
    display: block;
}
.send-box{
    margin: 0 auto;
    width: auto;
    margin: 100px 100px;
    box-shadow: 0 15px 25px #C1C1C1;
    background-color: rgb(248, 248, 248);
}

.user-box{
    display: flex;
    flex-direction: column;
    width: 560px;
    height: auto;
    margin-right: auto;
}

#input-file{
    border: dotted grey;
    width: auto;
    padding: 15px;
}

h3{
    margin-top: 0;
}

.inputTag{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
#fileInput{
    display: none;
}

label{
    cursor: pointer;
}

.formy{
    height: auto;
    padding: 15px;
}

#dest{
    margin-top: 10px;
    border: none;
    background-color: #F2F2F2;
    padding: 12px;
    border-radius: 3px;
    outline: none;
}

#dest:focus::placeholder{
    color: transparent;
}


.btn{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}

.btn_l{
    flex-basis: 50%;
    display: inline-block;
    outline: none;
    cursor: pointer;
    border: 1px solid var(--red);
    text-align: left;
    vertical-align: top;
    padding: calc(.875rem - 3px) 63px calc(.875rem - 3px) 15px;
    background-color: #00000000;
    font-size: 14px;
    letter-spacing: 0.16px;
    min-height: 48px;
    line-height: 1.29;
    color: var(--red);
    font-weight: 400;
    transition: background 70ms cubic-bezier(0,0,.38,.9),box-shadow 70ms cubic-bezier(0,0,.38,.9),border-color 70ms cubic-bezier(0,0,.38,.9),outline 70ms cubic-bezier(0,0,.38,.9);
}

.btn_l:hover{
    background: var(--red);
    color: #fff;
}

#title{
    color: var(--red);
    margin: 0px;
}



</style>