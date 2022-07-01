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
                        <td><button class="btn" @click.prevent="downloadFile(info.fileID)"> Télécharger </button></td>
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
            const userPassword = this.$store.getters.user.pwd
            const userToDecRsaPrivSaltStr = this.$store.getters.user.salt  // string type
            const userToDecRsaPrivIvStr = this.$store.getters.user.iv  // string type
            const userRsaPrivateKeyStr = this.$store.getters.user.privateKey   // string type

            const dataFromServer = await axios.post("http://localhost:5000/file/download", { fileID: fileID }, { headers: { token: this.$store.getters.token } } )
            const fileToDecryptStr = dataFromServer.data  // string type
            const fileAesKeyStr = dataFromServer.publickey // string type
            const fileIvStr = dataFromServer.iv // string type
            const fileType = dataFromServer.type
            const fileName = dataFromServer.name

            // convert everything from string to ArrayBuffer
            const userToDecRsaPrivSaltAB = this.strToArrayBuf(userToDecRsaPrivSaltStr)
            const userToDecRsaPrivIvAB = this.strToArrayBuf(userToDecRsaPrivIvStr)
            const userRsaPrivateKeyAB = this.strToArrayBuffer(userRsaPrivateKeyStr)
            const dataToDecryptAB = this.strToArrayBuffer(fileToDecryptStr)
            const fileAesKeyAB = this.strToArrayBuffer(fileAesKeyStr)
            const fileIvAB = this.strToArrayBuffer(fileIvStr)

            // reconstruction of the AES sym key with the userpassword the iv and the salt
            const keyMaterial = await this.aesKeyMaterial(userPassword);
            const aesKeyToDecryptRsaCryptoKey = await this.aesKey(keyMaterial, userToDecRsaPrivSaltAB);

            // decryption of the RSA private key 
            const rsaPrivateKeyPlain = await this.aesDecryptRsaPrivateKey(userToDecRsaPrivIvAB, aesKeyToDecryptRsaCryptoKey, userRsaPrivateKeyAB)

            // import the RSA private key to CryptoKey type 
            const rsaPrivateKeyCryptoKey = await this.importRsaPrivateKey(rsaPrivateKeyPlain)

            // decryption of the AES sym key (used to decrypt the file) and import it to CryptoKey
            const fileAesKeyABPlain = await this.rsaDecrypt(fileAesKeyAB, rsaPrivateKeyCryptoKey)
            const fileAesKeyCryptoKey = await this.importAesKey(fileAesKeyABPlain)
            
            // decryption of the IV used to decrypt the file
            const fileIvPlain = await this.rsaDecrypt(fileIvAB, rsaPrivateKeyCryptoKey)


            /*** decryption of the file ***/
            const filePlainAB = await this.aesDecryptFile(fileIvPlain, fileAesKeyCryptoKey, dataToDecryptAB)  // we now have the ArrayBuffer of the file!
            
            /*** display file ***/
            // convert the ArrayBuffer file back to a blob
            const blob = new Blob(filePlainAB, { type: fileType })  // we need to set the 'type' option of the blob ?
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.hrel = downloadUrl
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            URL.revokeObjectURL(downloadUrl)
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

        // 2. the actuall AES key
        aesKey: async function (keyMaterial, user_salt) {
            let symKey = await window.crypto.subtle.deriveKey( // returns a CryptoKey when the promise is fulfilled
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

        
        // actual decryption algorithm
        aesDecryptRsaPrivateKey: async function (initVector, aesKey, rsaPrivateEncKey){
            let plaintext = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: initVector
                },
                aesKey,
                rsaPrivateEncKey
            );
            return plaintext
        }, 

        /***** (**) decryption of the AES sym key (or the IV) to decrypt the file - WE NEED : rsa private key (or IV) *****/
        // import of the RSA private key of the user back to CryptoKey type
        importRsaPrivateKey: async function (keyData){  // typeof(keyData) = ArrayBuffer
            let privCryptoKey = await window.crypto.subtle.importKey(
                "pkcs8",
                keyData,
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256",
                },
                true,
                ["decrypt"]
            );
            return privCryptoKey
        },
        
        // the actual RSA decryption 
        rsaDecrypt: async function (encrAesKeyOrIv, rsaPrivKey){
            let plaintext = await window.crypto.subtle.decrypt(
                {
                    name: "RSA-OAEP"
                },
                rsaPrivKey,
                encrAesKeyOrIv
            );
            return plaintext
        },

        /***** decryption of the date file with AES - WE NEED : the AES sym key and the iv decrypted with (**) and the actual data file *****/
        // import the AES key from ArrayBuffer to CryptoKey
        importAesKey: async function (keyData){
            let privCryptoKey = await window.crypto.subtle.importKey(
                "raw",
                keyData,  // the ArrayBuffer to convert back to CryptoKey
                "AES-GCM",
                true,
                ["encrypt", "decrypt"]
            );
            return privCryptoKey
        },

        // the actual AES decryption
        aesDecryptFile: async function (initVector, aesKey, encFileData){
            let plaintext = window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: initVector
                },
                aesKey,
                encFileData  // data to decrypt 
            );
            return plaintext
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