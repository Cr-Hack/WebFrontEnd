<template>
    <div>
        <nav-bar />
        <div class="table-wrapper">
            <table class="style-table">
                <thead>
                    <tr>
                        <th>Expéditeur</th>
                        <th>Destinataire</th>
                        <th class="over">Type</th>
                        <th>Fichier</th>
                        <th>Taille</th>
                        <th>Date/heure</th>
                        <th style="background-color: var(--red);">Télécharger</th>
                        <th style="background-color: var(--red);">Supprimer</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(info, index) of infos" :key="index">
                        <td>{{info.sender}}</td>
                        <td>{{info.other == info.sender ? this.$store.getters.user.email : info.other}}</td>
                        <td><i :class="formatType(info.type)"></i></td>
                        <td>{{ info.name }}</td>
                        <td>{{formatSize(info.size)}}</td>
                        <td>{{formatDateTime(info.datedeposite)}}</td>

                        <td><button class="btn" @click="downloadFile(info.fileID)"> <i class="fa-solid fa-download" id="btn-logo"></i> </button></td>
                        <td><button class="btn" @click="deleteFile(info.fileID)"><i class="fa-solid fa-minus" id="btn-logo"></i></button></td>

                    </tr>
                </tbody>
                <tbody v-if="this.infos.length == 0">
                    <td colspan="8"><span id="emptyTable"><h2><i class="fa-solid fa-magnifying-glass"></i> Je pense que vous n'avez aucun fichier...</h2></span></td>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import NavBar from './sidebar/NavBar.vue'

// stream
const streamSaver = require('streamsaver')


export default {
    components : {NavBar}, 
    data(){
        return{
            infos : this.created()
        }
    },
    methods: {
        created: async function (){
            axios.post('http://localhost:5000/file/view', {}, {headers:{token: this.$store.getters.token}})
                .then((response) => {
                    this.infos = response.data.files
                })
                .catch(() => {
                    this.infos = []
                })
        }, 


        deleteFile: async function(fileID){
            const fileToDelete = await axios.post("http://localhost:5000/file/delete", {fileID: fileID},{ headers: { token: this.$store.getters.token } })
            let index = this.findIndex(fileID)
            if(index != -1) this.infos.splice(index, 1)
            console.log(fileToDelete.data)
        },

        findIndex: function(fileID) {
            for(var i = 0; i < this.infos.length; i++) {
                if (this.infos[i].fileID == fileID) return i
            }
            return -1
        },

        downloadFile: async function (fileID) {
            try{
                //console.log("j'ai cliqué sur le bouton télécharger")
                const userPassword = this.$store.getters.user.pwd
                const userToDecRsaPrivSaltStr = this.$store.getters.user.salt  // string type
                const userToDecRsaPrivIvStr = this.$store.getters.user.iv  // string type
                const userRsaPrivateKeyStr = this.$store.getters.user.privateKey   // string type

                // ASK THINGS ABOUT PART 0 OF THE FILE
                const dataFromServer = await axios.post("http://localhost:5000/file/download", { fileID: fileID, partNumber: 0 }, { headers: { token: this.$store.getters.token } })

                const fileAesKeyStr = dataFromServer.data.aeskey  // string type
                
                // const fileType = dataFromServer.data.type  // string type 
                const fileName = dataFromServer.data.name  // string type
                const fileSize = dataFromServer.data.size
                var totalParts = dataFromServer.data.totalParts

                // convert everything from string to ArrayBuffer
                //console.log()
                const userToDecRsaPrivSaltAB = this.base64ToArrayBuffer(userToDecRsaPrivSaltStr)  // we might need to convert that back to uint8array
                const userToDecRsaPrivIvAB = this.base64ToArrayBuffer(userToDecRsaPrivIvStr)  // we might need to convert that back to uint8array
                const userRsaPrivateKeyAB = this.base64ToArrayBuffer(userRsaPrivateKeyStr)
                const fileAesKeyAB = this.base64ToArrayBuffer(fileAesKeyStr)
                

                // convert salt and IV back to uint8array
                const userToDecRsaPrivSaltUint8Array = new Uint8Array(userToDecRsaPrivSaltAB)
                const userToDecRsaPrivIvUint8Array = new Uint8Array(userToDecRsaPrivIvAB)

                // reconstruction of the AES sym key with the userpassword the iv and the salt
                const keyMaterial = await this.aesKeyMaterial(userPassword);
                const aesKeyToDecryptRsaCryptoKey = await this.aesKey(keyMaterial, userToDecRsaPrivSaltUint8Array);

                // decryption of the RSA private key 
                const rsaPrivateKeyPlain = await this.aesDecryptRsaPrivateKey(userToDecRsaPrivIvUint8Array, aesKeyToDecryptRsaCryptoKey, userRsaPrivateKeyAB)

                // import the RSA private key to CryptoKey type 
                const rsaPrivateKeyCryptoKey = await this.importRsaPrivateKey(rsaPrivateKeyPlain)

                // decryption of the AES sym key (used to decrypt the file) and import it to CryptoKey
                const fileAesKeyABPlain = await this.rsaDecrypt(fileAesKeyAB, rsaPrivateKeyCryptoKey)
                const fileAesKeyCryptoKey = await this.importAesKey(fileAesKeyABPlain)


                /***** start the stream *****/
                const fileStream = streamSaver.createWriteStream(fileName, {
                    size: fileSize, // (optional filesize) Will show progress
                })

                const writer = fileStream.getWriter()

                try{
                    for (let i = 0; i < totalParts; i++) {
                        // info about the chunk to decrypt 
                        let dataFromServer = await axios.post("http://localhost:5000/file/download", { fileID: fileID, partNumber: i }, { headers: { token: this.$store.getters.token } })
                        // the file to decrypt
                        let dataFromServerFile = await axios.post("http://localhost:5000/file/download", { fileID: fileID, file: true, partNumber: i }, { headers: { token: this.$store.getters.token }, responseType: "blob" })
                        let chunkToDecryptAB = await dataFromServerFile.data.arrayBuffer()

                        //console.log("les données que je reçois")
                        //console.log(dataFromServer)

                        let chunkIvStr = dataFromServer.data.iv // string type
                        //console.log("IV-------------")
                        //console.log(chunkIvStr)
                        let chunkIvAB = this.base64ToArrayBuffer(chunkIvStr)
                        //console.log(chunkIvAB)

                        // decryption of the IV used to decrypt the file
                        let chunkIvPlain = await this.rsaDecrypt(chunkIvAB, rsaPrivateKeyCryptoKey)  // returns an ArrayBuffer
                        // IV back to uint8array
                        let chunkIvPlainUint8Array = new Uint8Array(chunkIvPlain)

                        /*** decryption of the file ***/
                        //console.log("decryption of chunk " + i + " started!")
                        let chunkPlain = await this.aesDecryptFile(chunkIvPlainUint8Array, fileAesKeyCryptoKey, chunkToDecryptAB)  // we now have the ArrayBuffer of the file!
                        //console.log("decryption of chunk " + i + " ended!")

                        writer.write(new Uint8Array(chunkPlain))
                    }
                }catch(error){
                    writer.abort()
                    throw error
                }
                writer.close()
            //console.log("decryption of the whole file completed!")
            }catch(error) {
                console.log(error)
                alert("Une erreur est survenue lors du téléchargement du fichier.")
            }
        },

        // download ArrayBuffer to file 
        downloadBlob: function (filePlainAB, fileType, fileName) {
            // convert the ArrayBuffer file back to a blob
            const blob = new Blob([filePlainAB], { type: fileType })  // we need to set the 'type' option of the blob ?
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)

            console.log("8")
            console.log("the file has been downloaded to the computer!")
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

        /***** decryption of RSA private key with AES - WE NEED : userpassword, iv, salt *****/
        
        // convert the iv and the salt (string) back to ArrayBuffer

        base64ToArrayBuffer: function(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        },

        ///// reconstruction of the AES sym key with the userpassword the iv and the salt
        // 1. the AES "key material"
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

        // 2. the actuall AES key
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

        // actual decryption algorithm
        aesDecryptRsaPrivateKey: async function (initVector, aesKey, rsaPrivateEncKey){
            try {
                return await window.crypto.subtle.decrypt(
                    {
                        name: "AES-GCM",
                        iv: initVector
                    },
                    aesKey,
                    rsaPrivateEncKey
                );
            } catch (err) {
                console.log("decryption failed", err);
            }
            
            
        }, 

        /***** (**) decryption of the AES sym key (or the IV) to decrypt the file - WE NEED : rsa private key (or IV) *****/
        // import of the RSA private key of the user back to CryptoKey type
        importRsaPrivateKey: async function (keyData){  // typeof(keyData) = ArrayBuffer
            try {
                return await window.crypto.subtle.importKey(
                    "pkcs8",
                    keyData,
                    {
                        name: "RSA-OAEP",
                        hash: "SHA-256",
                    },
                    true,
                    ["decrypt"]
                );

            } catch (err) {
                console.log("RSA key import failed ", err)
            }
        },
        
        // the actual RSA decryption 
        rsaDecrypt: async function (encrAesKeyOrIv, rsaPrivKey){
            try {
                return await window.crypto.subtle.decrypt(
                    {
                        name: "RSA-OAEP"
                    },
                    rsaPrivKey,
                    encrAesKeyOrIv
                );
            } catch (err) {
                console.log("RSA key decryption failed ", err)
            }
        },

        /***** decryption of the date file with AES - WE NEED : the AES sym key and the iv decrypted with (**) and the actual data file *****/
        // import the AES key from ArrayBuffer to CryptoKey
        importAesKey: async function (keyData){
            try {
                return await window.crypto.subtle.importKey(
                    "raw",
                    keyData,  // the ArrayBuffer to convert back to CryptoKey
                    "AES-GCM",
                    true,
                    ["encrypt", "decrypt"]
                );
            } catch (err) {
                console.log("AES key import failed ", err)
            }
        },

        // the actual AES decryption of the file
        aesDecryptFile: async function (initVector, aesKey, encFileData){
            try {
                return await window.crypto.subtle.decrypt(
                    {
                        name: "AES-GCM",
                        iv: initVector
                    },
                    aesKey,
                    encFileData  // data to decrypt 
                );
            } catch (err) {
                console.log("File decryption failed, ask sender to resend file ", err)
                return 1
            }
        },

        formatSize: function (input) {
            let bytes = Number(input)
            if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
            else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
            else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
            else if (bytes > 1)           { bytes = bytes + " bytes"; }
            else if (bytes == 1)          { bytes = bytes + " byte"; }
            else                          { bytes = "0 bytes"; }
            return bytes;
        },

        formatDateTime: function (str) {
            try{
                var ints = str.match(/\d+/g)
                return ints[0] + "/" + ints[1] + "/" + ints[2] + " " + ints[3] + ":" + ints[4]
            }catch (error) {
                return str
            }
        },

        formatType: function (type) {
            let htmlbase = 'icons fa-solid fa-'//<span class="material-icons">'
            switch (type) {
                case "application/pdf":
                    htmlbase += 'file-pdf'
                    break
                case "application/x-zip-compressed":
                    htmlbase += 'file-archive'
                    break
                case "application/vnd.oasis.opendocument.spreadsheet":
                    htmlbase += 'file-excel'
                    break
                case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                    htmlbase += 'file-powerpoint'
                    break
                case "image/png":
                case "image/jpeg":
                case "application/vnd.oasis.opendocument.graphics":
                    htmlbase += 'image'
                    break
                case "audio/mpeg":
                    htmlbase += 'volume-high'
                    break
                case "video/mp4":
                case "video/webm":
                    htmlbase += 'video'
                    break
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                case "text/plain":
                case "application/msword":
                    htmlbase += 'file'
                    break
                default:
                    console.log(type + " is not defined !")
                    htmlbase += 'file-circle-exclamation'
                    break
            }
            return htmlbase //+ '</span>'
        }
    }

}

</script>

<style scoped>

#no-files{
    color: #a3a3a3;
    font-style: italic;
    font-size: 20px;
}
.table-wrapper{
    margin: 10px 70px 70px;
    box-shadow: 0px 35px 50px rgba(0,0,0,0.2);
    /* max-height: 800px; */
    margin-bottom : 40% ; 
}

th{
    position: sticky;
    top: 0px;
}

#emptyTable{
    color: #a3a3a3;
    font-style: oblique;
    font-size: 10px;
}

button{
  
    width: auto;
    max-width: 100px;
    display: inline-block;
    outline: none;
    cursor: pointer;
    border: 1px solid var(--red);
    vertical-align: top;
    background-color: #00000000;
    color: var(--red);
    transition: background 70ms cubic-bezier(0,0,.38,.9),box-shadow 70ms cubic-bezier(0,0,.38,.9),border-color 70ms cubic-bezier(0,0,.38,.9),outline 70ms cubic-bezier(0,0,.38,.9);

}

button:hover{
    background: var(--red);
    color: #fff;
}

#btn-logo{
    margin: 0 auto;
}

.style-table{
    font-size: 12px;
    font-weight: normal;
    border: none;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    background-color: white;
}

@media screen and (max-width:800px) {
    .table-wrapper{
        overflow-x: auto;
    }
}

.style-table td, .style-table th{
    text-align: center;
    padding: 8px;
}

.style-table td{
    border-right: 1px solid #F8F8F8;
    font-size: 12px;
}

.style-table th {
    background-color: var(--blue);
    color: white;
}

.icons {
    scale: 1.8;
}

.over {
    z-index: 1;
}
</style>