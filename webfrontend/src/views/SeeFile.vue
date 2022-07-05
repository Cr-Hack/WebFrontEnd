<template>
    <div>
        <nav-bar />
        <div class="table-wrapper">
            <table class="style-table">
                <thead>
                    <tr>
                        <th>De</th>
                        <th>A</th>
                        <th>Fichier</th>
                        <th>Date/heure</th>
                        <th>Télécharger</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(info, index) of infos" :key="index">
                        <td>{{ info.sender }}</td>
                        <td>{{ info.other == info.sender ? this.$store.getters.user.email : info.other }}</td>
                        <td>{{ info.name }}</td>
                        <td>{{ info.datedeposite }}</td>
                        <td><button class="btn" @click="downloadFile(info.fileID)"> Télécharger le fichier </button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import NavBar from './sidebar/NavBar.vue'

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
					console.log(response)
                })
                .catch((err) => {
                    console.log(err)
                })
        }, 

        // function to download file : fetch the data, decrypt it, and convert it back to a file (blob)
        downloadFile: async function (fileID) {
            console.log("j'ai cliqué sur le bouton télécharger")
            const userPassword = this.$store.getters.user.pwd
            const userToDecRsaPrivSaltStr = this.$store.getters.user.salt  // string type
            const userToDecRsaPrivIvStr = this.$store.getters.user.iv  // string type
            const userRsaPrivateKeyStr = this.$store.getters.user.privateKey   // string type

            console.log("the user passworld fetched from the token")
            console.log(userPassword)

            console.log("file ID of the file to be downloaded")
            console.log(fileID)

            const dataFromServer = await axios.post("http://localhost:5000/file/download", { fileID: fileID }, { headers: { token: this.$store.getters.token } } )
            console.log(dataFromServer.data)
            const dataFromServerFile = await axios.post("http://localhost:5000/file/download", { fileID: fileID, file: true }, { headers: { token: this.$store.getters.token }, responseType: "blob" } )
            const dataToDecryptAB = await dataFromServerFile.data.arrayBuffer()
            
            const fileAesKeyStr = dataFromServer.data.publickey  // string type
            const fileIvStr = dataFromServer.data.iv // string type
            const fileType = dataFromServer.data.type  // string type 
            const fileName = dataFromServer.data.name  // string type

            console.log("the string of the file to be decrypted")
            console.log(dataToDecryptAB)
            console.log(this.arrayBufferToStr(dataToDecryptAB))
            console.log("encrypted iv to decrypt the file for the user")
            console.log(fileIvStr)
            console.log("encrypted file aes key to decrypt the file for the user")
            console.log(fileAesKeyStr)

            // convert everything from string to ArrayBuffer
            const userToDecRsaPrivSaltAB = this.strToArrayBuffer(userToDecRsaPrivSaltStr)  // we might need to convert that back to uint8array
            const userToDecRsaPrivIvAB = this.strToArrayBuffer(userToDecRsaPrivIvStr)  // we might need to convert that back to uint8array
            const userRsaPrivateKeyAB = this.strToArrayBuffer(userRsaPrivateKeyStr)
            const fileAesKeyAB = this.strToArrayBuffer(fileAesKeyStr)
            const fileIvAB = this.strToArrayBuffer(fileIvStr)

            // convert salt and IV back to uint8array
            const userToDecRsaPrivSaltUint8Array = new Uint8Array(userToDecRsaPrivSaltAB) 
            const userToDecRsaPrivIvUint8Array = new Uint8Array(userToDecRsaPrivIvAB)

            console.log("1")
            // reconstruction of the AES sym key with the userpassword the iv and the salt
            const keyMaterial = await this.aesKeyMaterial(userPassword);
            const aesKeyToDecryptRsaCryptoKey = await this.aesKey(keyMaterial, userToDecRsaPrivSaltUint8Array);

            // DEBUG 
            console.log("the AES decryption key converted to str")
            const debugkeyAB = await window.crypto.subtle.exportKey("raw", aesKeyToDecryptRsaCryptoKey)
            const debugkeystr = this.arrayBufferToStr(debugkeyAB)
            console.log(debugkeystr)


            console.log("2")
            // decryption of the RSA private key 
            const rsaPrivateKeyPlain = await this.aesDecryptRsaPrivateKey(userToDecRsaPrivIvUint8Array, aesKeyToDecryptRsaCryptoKey, userRsaPrivateKeyAB)

            console.log("3")
            // import the RSA private key to CryptoKey type 
            const rsaPrivateKeyCryptoKey = await this.importRsaPrivateKey(rsaPrivateKeyPlain)

            console.log("4")
            // decryption of the AES sym key (used to decrypt the file) and import it to CryptoKey
            const fileAesKeyABPlain = await this.rsaDecrypt(fileAesKeyAB, rsaPrivateKeyCryptoKey)
            const fileAesKeyCryptoKey = await this.importAesKey(fileAesKeyABPlain)
            
            console.log("5")
            // decryption of the IV used to decrypt the file
            const fileIvPlain = await this.rsaDecrypt(fileIvAB, rsaPrivateKeyCryptoKey)  // returns an ArrayBuffer
            // IV back to uint8array
            const fileIvPlainUint8Array = new Uint8Array(fileIvPlain)

            console.log("6")
            /*** decryption of the file ***/
            const filePlainAB = await this.aesDecryptFile(fileIvPlainUint8Array, fileAesKeyCryptoKey, dataToDecryptAB)  // we now have the ArrayBuffer of the file!
            
            console.log("7")
            /*** download file to computer ***/
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

        arrayBufferToStr: function (arrayBuf) {
            return String.fromCharCode.apply(null, new Uint8Array(arrayBuf));
        },

        /***** decryption of RSA private key with AES - WE NEED : userpassword, iv, salt *****/
        
        // convert the iv and the salt (string) back to ArrayBuffer
        strToArrayBuffer: function (str){
            const buf = new ArrayBuffer(str.length);
            const bufView = new Uint8Array(buf);
            for (let i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
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

        // the actual AES decryption
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
            }
        }
    }

}

</script>

<style scoped>
.table-wrapper{
    display: flex;
    flex: wrap;
    justify-content: center;
    margin: 10px 70px 70px;
    box-shadow: 0px 35px 50px rgba(0,0,0,0.2);
    max-height: 800px;
    overflow-y: scroll ;

}

th{
    position: sticky;
    top: 0px;
}

button{
  
  width: 100%;
  max-width: 100px;
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

button:hover{
    background: var(--red);
    color: #fff;
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
</style>