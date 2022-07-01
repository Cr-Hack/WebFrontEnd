<template>
    <nav-bar/>
    <div class="send-box">
        <h2 id="title">Formulaire d'envoi chiffré</h2>
        <form class="formy">
            <div @dragenter.prevent="toggleActive" 
            @dragleave.prevent="toggleActive" @dragover.prevent
            @drop.prevent="drop"
            :class="{'active-dropzone' : active}"
            class="user-box" id="input-file">
                <img id="file-ip-1-preview"/>
                <label for="fileInput">
                    <h3>Seléctionner votre fichier (.pdf, .jpg ou .png)</h3> 
                    <i class="fa-solid fa-file-circle-plus fa-2xl"></i>
                    <input id="fileInput" type="file" required="required" @change="showPreview($event);">
                </label>
            </div>
            <div class="file-info">
                <span @change="selectedFile" id="file">Fichier : {{dropzoneFile.name}}</span>
            </div>
            <div class="user-box" id="container-dest">
                <input type="text" id="dest" class="dest" required="required" placeholder="Destinataire">
            </div>
        </form>
        <div class="btn">
            <button type="submit" id="confirm" class="btn_l">Confirmer</button>
            <button type="submit" id="del" class="btn_l">Annuler</button>
        </div>
    </div>
</template>

<script>
import NavBar from './sidebar/NavBar.vue'
import {ref} from 'vue';
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
            active.value = !active.value
        };

        const selectedFile = () => {
            dropzoneFile.value = document.querySelector('.dest').files[0]
        }

        return {active, toggleActive, dropzoneFile, drop, selectedFile};

    },

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