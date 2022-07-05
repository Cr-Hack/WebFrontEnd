<template>
    <div>
        <nav-bar/>
        <div class="send-box">
            <h2 id="title">Formulaire d'envoi chiffré</h2>
            <form class="formy" method="post" @submit.prevent="handleFile()">
                <div @dragenter.prevent="toggleActive" 
                @dragleave.prevent="toggleActive" @dragover.prevent
                @drop.prevent="drop"
                :class="{'active-dropzone' : active}"
                class="user-box" id="input-file">
                    <img id="file-ip-1-preview"/>
                    <label for="fileInput">
                        <h3>Seléctionner votre fichier (.pdf, .jpg ou .png)</h3> 
                        <i class="fa-solid fa-file-circle-plus fa-2xl"></i>
                        <input id="fileInput" type="file" required="required" class="dropzoneFile" @change="selectedFile" multiple>
                    </label>
                </div>
                <div class="file-info">
                    <span id="file">Fichier : {{dropzoneFile.name}}</span>
                </div>
                <div class="user-box" id="container-dest">
                    <input v-model="receiverEmail" type="text" id="dest" class="dest" required="required" placeholder="Destinataire">
                </div>
                <div class="btn">
                    <button type="submit" id="confirm" class="btn_l">Confirmer</button>
                    <button type="submit" id="del" class="btn_l">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import NavBar from './sidebar/NavBar.vue'
import {ref} from 'vue';
const axios = require('axios')

export default {
    components : {NavBar}, 
    setup() {
        const active = ref(false);
        const toggleActive = () => {
            active.value = !active.value;
        };
        let dropzoneFile = ref("");

        const drop = (event) => {
            dropzoneFile.value = event.dataTransfer.files[0];
            active.value = !active.value;
        };
        
        const selectedFile = () => {
            dropzoneFile.value = document.querySelector('.dropzoneFile').files[0];
        }
        return {active, toggleActive, dropzoneFile, drop, selectedFile};
    },

    data() {
        return {
            fileToSend: '',
            receiverEmail: ''
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

            // files is an array of files 
            const files = document.getElementById("fileInput").files
            var selectedFile 

            for (let i = 0; i < files.length; i++) {
                selectedFile = files[i]

                console.log(selectedFile.type)
                console.log(selectedFile.size)
                console.log(selectedFile.name)

                console.log(selectedFile)
                console.log(typeof (selectedFile))
                console.log(selectedFile.text())

                var arrayBuf = await selectedFile.arrayBuffer()  // convert the file to an arraybuffer

                // AES key and IV
                const symKey = await this.aesKeyGeneration() // return an CryptoKey type
                const initVector = window.crypto.getRandomValues(new Uint8Array(12))  // initialisation vector generation

                console.log("Encrypting file ....")

                // file encryption 
                var encryptedFile = await this.encryptFile(arrayBuf, initVector, symKey);  // returns an ArrayBuffer

                console.log("Encryption done !")

                /***** AES symmetric key encryption with the RSA public key of the receiver AND the sender *****/
                // fetch the receiver's public RSA key (type string)
                const receiverID = await axios.post("http://localhost:5000/users/getid", { email: this.receiverEmail }, { headers: { token: this.$store.getters.token } })
                const resultsPublicKey = await axios.post("http://localhost:5000/users/publickey", { userID: receiverID.data.userId }, { headers: { token: this.$store.getters.token } })
                const receiverPublicKeyStr = resultsPublicKey.data.publickey
                const senderPublicKeyStr = this.$store.getters.user.publicKey

                // convert the string to ArrayBuffer
                const receiverPublicKeyAB = this.base64ToArrayBuffer(receiverPublicKeyStr)
                const senderPublicKeyAB = this.base64ToArrayBuffer(senderPublicKeyStr)

                // convert the ArrayBuffer to CryptoKey (with the importKey function)
                const receiverPubKeyCryptoKey = await this.importPubKey(receiverPublicKeyAB)  // function to implement
                const senderPubKeyCryptoKey = await this.importPubKey(senderPublicKeyAB)

                // convert the AES sym key (used to encrypt file) from CryptoKey to ArrayBuffer (export)
                const symKeyAB = await window.crypto.subtle.exportKey("raw", symKey)  // export to an ArrayBuffer type

                // encrypt the aes sym key with the sender and receiver public key
                const receiverEncSymKey = await this.rsaEncrypt(symKeyAB, receiverPubKeyCryptoKey)  // returns an arraybuffer
                const senderEncSymKey = await this.rsaEncrypt(symKeyAB, senderPubKeyCryptoKey)


                /***** init vector encryption for sender and receiver *****/
                // convert uint8array to arraybuffer
                const ivArrayBuf = this.uint8ArrayToArrayBuffer(initVector)

                // encrypt the IVs with RSA public keys
                const receiverEncIv = await this.rsaEncrypt(ivArrayBuf, receiverPubKeyCryptoKey)
                const senderEncIv = await this.rsaEncrypt(ivArrayBuf, senderPubKeyCryptoKey)

                console.log("longueur de la clé symétrique chiffrée du fichier pour récepteur et envoyeur")
                console.log(this.arrayBufferToBase64(receiverEncSymKey))
                console.log(this.arrayBufferToBase64(senderEncSymKey))
                console.log(new Uint8Array(senderEncSymKey))

                console.log("longueur du vecteur d'init")
                console.log(this.arrayBufferToBase64(receiverEncIv))
                console.log(this.arrayBufferToBase64(senderEncIv))

                //console.log("DATA SENDED !!! " + this.arrayBufferToBase64(encryptedFile))

                const toServer = {
                    //data: this.arrayBufferToBase64ingForFiles(encryptedFile),
                    data: new Blob([encryptedFile]),
                    receiverID: receiverID.data.userId,
                    name: selectedFile.name,
                    type: selectedFile.type || selectedFile.type.length > 0 ? selectedFile.type : "text/plain",
                    size: selectedFile.size,
                    receiverkey: this.arrayBufferToBase64(receiverEncSymKey),
                    senderkey: this.arrayBufferToBase64(senderEncSymKey),
                    receiverIV: this.arrayBufferToBase64(receiverEncIv),
                    senderIV: this.arrayBufferToBase64(senderEncIv)
                }

                console.log("the encrypted file in string")
                //console.log(encryptedFile)
                //console.log(this.arrayBufferToBase64(encryptedFile))
                console.log("the encrypted receiver IV for file for file decryption in string")
                console.log(this.arrayBufferToBase64(receiverEncIv))
                console.log("the encrypted receiver aes key for file decryption in string")
                console.log(this.arrayBufferToBase64(receiverEncSymKey))


                axios.post("http://localhost:5000/file/upload", toServer, { headers: { token: this.$store.getters.token, "Content-Type": "multipart/form-data" } })
                    .then(function (response) {
                        console.log(response);
                        alert("votre fichier a bien été envoyé")
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }

            
        },

        aesKeyGeneration: async function () {
            try {
                return await window.crypto.subtle.generateKey(
                    {
                        name: "AES-GCM",
                        length: 256
                    },
                    true,
                    ["encrypt", "decrypt"]
                );
            } catch (err) {
                console.log("AES key generation to encrypt file failed ", err)
            }
        }, 

        encryptFile: async function (filePlain, initVector, symKey) {  // filePlain is the file to encrypt, (type = arraybuffer)
            try {
                return await window.crypto.subtle.encrypt(
                    {
                        name: "AES-GCM",
                        iv: initVector,
                        tagLength: 128 // cf documentation to see the allowed lengths
                    },
                    symKey,
                    filePlain // data to cipher
                ); // return an ArrayBuffer
            } catch (err) {
                console.log("File encryption failed ", err)
            }
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

        base64ToArrayBuffer: function(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        },

        uint8ArrayToArrayBuffer: function (unit8array) {
            return unit8array.buffer.slice(unit8array.byteOffset, unit8array.byteLength + unit8array.byteOffset)
        },

        importPubKey: async function (keyData) {  // the type of keyData is ArrayBuffer
            try {
                return await window.crypto.subtle.importKey(
                    "spki",
                    keyData,
                    {
                        name: "RSA-OAEP",
                        hash: "SHA-256"  // WHY this ??? TBD
                    },
                    true,
                    ["encrypt"]
                )
            } catch (err) {
                console.log("RSA public key import failed ", err)
            }
        },

        rsaEncrypt:async function (aesKeyOrIvPlain, rsaPublicKey) {
            try {
                return await window.crypto.subtle.encrypt(
                    {
                        name: "RSA-OAEP"
                    },
                    rsaPublicKey,
                    aesKeyOrIvPlain  // data to encrypt
                );
            } catch (err) {
                console.log("AES key or IV encryotion failed ", err)
            }
        }
    }        
}
</script>

<style scoped>
.file-info{
    margin-right: 0;
    padding: 10px;
    text-align: left;
}

#file{
    word-wrap: break-word;
}

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

.active-dropzone{
    color: #fff;
    border: none;
    background-color: var(--red);
    transition: .2s ease-in-out;
}

#input-file{
    border-radius: 10px;
    border: dashed;
    width: auto;
    padding: 15px;
}

h3{
    margin-top: -10px;
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

    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
}

#dest:focus::placeholder{
    color: transparent;
}

#container-dest{
    width: 100%;
    max-width: 600px;
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

@media screen and (max-width: 600px){
    .btn{
        flex-direction: column;
    }
    .btn h3{
        font-size: 10vw;
    }
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