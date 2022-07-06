<template>
    <div>
        <nav-bar/>
        <div class="send-box">
            <h2 id="title">Formulaire d'envoi chiffré</h2>
            <form class="formy" method="post" @submit.prevent="handleFile()" @reset.prevent="deleteInputFile()">
                <div @dragenter.prevent="toggleActive" 
                @dragleave.prevent="toggleActive" @dragover.prevent
                @drop.prevent="drop"
                :class="{'active-dropzone' : active}"
                class="user-box" id="input-file">
                    <img id="file-ip-1-preview"/>
                    <label for="fileInput">
                        <h3>Seléctionner votre fichier (.pdf, .jpg ou .png)</h3> 
                        <i class="fa-solid fa-file-circle-plus fa-2xl"></i>
                        <input id="fileInput" type="file" required="required" class="dropzoneFile" @change="selectedFile" multiple="multiple">
                    </label>
                </div>
                <div class="file-info" v-for="(file, index) of dropzoneFile" :key="index">
                    <span id="file">Fichier : {{file.name}}</span>
                </div>
                <div class="user-box" id="container-dest">
                    <input v-model="receiverEmail" type="text" id="dest" class="dest" required="required" placeholder="Destinataire">
                </div>
                <div class="btn">
                    <button type="submit" id="confirm" class="btn_l">Confirmer</button>
                    <button type="reset" id="del" class="btn_l">Annuler</button>
                </div>
                <div v-if="progress" class="progress-wrapper">
                    <div id="progress" class="progress" :style="progress_style"></div>
                </div>
            </form>
        </div>
        <ul v-for="(action, index) of actions" :key="index">
            <li class="item">
                <div :class="action.class">
                    {{ action.message }}
                </div>
                <div class="timebar"></div>
                <div class="timebar-filled"></div>
            </li>
        </ul>
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
            dropzoneFile.value = ""
            dropzoneFile.value = event.dataTransfer.files;
            active.value = !active.value;
        };
        
        const selectedFile = () => {
            dropzoneFile.value = ""
            dropzoneFile.value = document.querySelector('.dropzoneFile').files;
            for(var i = 0; i < document.querySelector('.dropzoneFile').files.length; i++){
                    console.log(document.querySelector('.dropzoneFile').files[i])
            }
            
        }
        return {active, toggleActive, dropzoneFile, drop, selectedFile};
    },

    data() {
        return {
            files: [],
            fileToSend: '',
            receiverEmail: '',
            actions: [],
            progress: false,
            progress_style: "width: 0%"
        }
    }, 
    methods:{
        deleteInputFile: function(){
            for(var i = 0; i < document.getElementById("fileInput").files.length; i++){
                console.log("delete file here")
            }
        },

        handleFile: async function () {
            if(this.progress){
                alert("Une opération est déjà en cours.")
                return
            }
            this.progress = true
            //alert("j'ai cliqué sur le bouton confirmer")


            /***** fetch global data *****/
            // fetch the receiver's public RSA key (type string)
            console.log("demande infos au serveur")
            const receiverID = await axios.post("http://localhost:5000/users/getid", { email: this.receiverEmail }, { headers: { token: this.$store.getters.token } })
            const resultsPublicKey = await axios.post("http://localhost:5000/users/publickey", { userID: receiverID.data.userId }, { headers: { token: this.$store.getters.token } })
            const receiverPublicKeyStr = resultsPublicKey.data.publickey
            const senderPublicKeyStr = this.$store.getters.user.publicKey
            console.log("demande infos au serveur fin")

            // convert the string to ArrayBuffer
            const receiverPublicKeyAB = this.base64ToArrayBuffer(receiverPublicKeyStr)
            const senderPublicKeyAB = this.base64ToArrayBuffer(senderPublicKeyStr)
            // convert the ArrayBuffer to CryptoKey (with the importKey function)
            const receiverPubKeyCryptoKey = await this.importPubKey(receiverPublicKeyAB)  // function to implement
            const senderPubKeyCryptoKey = await this.importPubKey(senderPublicKeyAB)


            // files is an array of files 
            const files = document.getElementById("fileInput").files

            var unitprecentage = 100 / (files.length * 4)
            var selectedFile

            for (let i = 0; i < files.length; i++) {
                this.setProgressBar(unitprecentage * i * 4)
                selectedFile = files[i]

                var fileAB = await selectedFile.arrayBuffer()  // convert the file to an arraybuffer

                // AES key
                const symKey = await this.aesKeyGeneration()  // return an CryptoKey type qui encrypt the whole file 

                console.log("Encrypting file ....")
                this.setProgressBar(unitprecentage * i * 4 + (unitprecentage * 1))


                /*
                We are going to chunk the file to size of 64 Mo 
                */
                const nbchunks = Math.ceil((fileAB.byteLength / 2**20) / 64)
                console.log("total number of chuncks")
                console.log(nbchunks)

                // the initilising IV 
                const iv0 = window.crypto.getRandomValues(new Uint8Array(12))  // a new IV for each section of the file

                // encrypted file with all chunks
                var encryptedFile = new ArrayBuffer()

                const chunkSize = 64 * (2 ** 20)  // in octets (= 64 Mo) 

                /***** encryp each file chunk (with different iv but same aes key) *****/
                for (let i = 0; i < nbchunks; i++) {
                    //let ivchunk = this.incrementIv(iv0, i)
                    let ivchunk = window.crypto.getRandomValues(new Uint8Array(12))
                    console.log("the iv of the chunk")
                    console.log(ivchunk)

                    // the current chuck to enc
                    let chunkPlain = fileAB.slice(i * chunkSize, i * chunkSize + chunkSize);
                    console.log("the current chunk to encrypt")
                    console.log(chunkPlain)

                    console.log("the aes sym key to encrypt files")
                    console.log(symKey)

                    // encrypt the current chunk 
                    var chunkEnc = await this.aesEncryptFileChunk(chunkPlain, ivchunk, symKey)
                    console.log("current chunk encrypted")

                    // let's stick the current chunk to the previous sections
                    this.mergeArrayBuffers(encryptedFile, chunkEnc)
                    console.log("cunrent encrypted chunk merged")
                }

                this.setProgressBar(unitprecentage * i * 4 + (unitprecentage * 3))
                console.log("Encryption done !")
                
                // convert the AES sym key (used to encrypt file) from CryptoKey to ArrayBuffer (export)
                const symKeyAB = await window.crypto.subtle.exportKey("raw", symKey)  // export to an ArrayBuffer type

                // encrypt the aes sym key with the sender and receiver public key
                var receiverEncSymKey = await this.rsaEncrypt(symKeyAB, receiverPubKeyCryptoKey)  // returns an arraybuffer
                var senderEncSymKey = await this.rsaEncrypt(symKeyAB, senderPubKeyCryptoKey)

                // encryption of the initial IV with RSA public keys
                const iv0AB = this.uint8ArrayToArrayBuffer(iv0)
                var receiverEncIv = await this.rsaEncrypt(iv0AB, receiverPubKeyCryptoKey)
                var senderEncIv = await this.rsaEncrypt(iv0AB, senderPubKeyCryptoKey)

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

                try{
                    let response = await axios.post("http://localhost:5000/file/upload", toServer, { headers: { token: this.$store.getters.token, "Content-Type": "multipart/form-data" } })
                    console.log(response);
                    let action = {
                        message: "Le fichier " + selectedFile.name + " a bien été envoyé",
                        class: "success"
                    }
                    this.actions.push(action)
                    let view = this
                    setTimeout(() => {view.actions.splice(view.actions.indexOf(action), 1)}, 8000)
                }catch (error) {
                    console.log(error)
                    let action = {
                        message: "Erreur lors de l'envoi du fichier " + selectedFile.name + ", veuillez recommencer !",
                        class: "error"
                    }
                    this.actions.push(action)
                    let view = this
                    setTimeout(() => {view.actions.splice(view.actions.indexOf(action), 1)}, 20000)
                }

                this.setProgressBar(unitprecentage * i * 4 + (unitprecentage * 4))
            }
            document.getElementById("fileInput").value = ""
            this.receiverEmail = ""
            this.progress = false
        },

        mergeArrayBuffers: function (ab1, ab2) {
            var tmp = new Uint8Array(ab1.byteLength + ab2.byteLength);
            tmp.set(new Uint8Array(ab1), 0);
            tmp.set(new Uint8Array(ab2), ab1.byteLength);
            return tmp.buffer;
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

        aesEncryptFileChunk: async function (filePlain, initVector, symKey) {  // filePlain is the file to encrypt, (type = arraybuffer)
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
            var binary_string = window.atob(escape(base64));
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

        rsaEncrypt: async function (aesKeyOrIvPlain, rsaPublicKey) {
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
        },

        setProgressBar: function (percentage) {
            this.progress_style = "width: " + percentage + "%"
        },

        hashencryption: async function (message1){
            const msgUint8_1 = new TextEncoder().encode(message1);                           // encode as (utf-8) Uint8Array
            const hashBuffer_1 = await crypto.subtle.digest('SHA-256', msgUint8_1);           // hash the message
            const hashArray_1 = Array.from(new Uint8Array(hashBuffer_1));                     // convert buffer to byte array
            const hashHex_1 = hashArray_1.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
            return hashHex_1 ;
        },

        incrementIv: async function (initVector, id) {
            let strIV = this.arrayBufferToBase64(this.uint8ArrayToArrayBuffer(initVector))
            let hash = await this.hashencryption(strIV + id)
            return new Uint8Array(this.base64ToArrayBuffer(hash.slice(0, strIV.length)))
        },
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
    margin-bottom: 18% ;
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

.item {
    list-style: none;
    width: auto;
    box-shadow: 0 15px 25px #C1C1C1;
    margin: 20px 100px 20px 60px;
    text-align: left;
    display: flex;
    flex-flow: row wrap;
}

.success,.error {
    padding: 15px;
    padding-bottom: 11px;
    flex-basis: 100%;
}

.success {
    background-color: #1F9D1B;
}

.error {
    background-color: #F3602B;
}

.timebar,.timebar-filled{
    height: 4px;
}

.success+.timebar{
    background-color: #1C8E18;
    animation: 8.5s durationBar;
    flex-shrink: 1;
}
.success+.timebar+.timebar-filled {
    background-color: #1F9D1B;
    flex-basis: 0;
    flex-grow: 1;
}

.error+.timebar{
    background-color: #cc3f0c;
    animation: 20.5s durationBar;
    flex-shrink: 1;
}

.error+.timebar+.timebar-filled {
    background-color: #F3602B;
    flex-basis: 0;
    flex-grow: 1;
}

@-webkit-keyframes durationBar { from { flex-basis: 0%; } to { flex-basis:100%; }  }
@keyframes durationBar { from { flex-basis: 0%; } to { flex-basis:100%; }  }

.progress-wrapper {
    width: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid black;
}

.progress {
    background-color: #922D50;
    height: 10px;
}

</style>