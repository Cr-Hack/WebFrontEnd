<template>
    <nav-bar/>
    <div class="send-box">
        <h2 id="title">Formulaire d'envoi chiffré</h2>
        <form class="formy">
            <div class="user-box" id="input-file">
                <img id="file-ip-1-preview"/>
                <label for="fileInput">
                    <h3>Seléctionner votre fichier (.pdf, .jpg ou .png)</h3> 
                    <i class="fa-solid fa-file-circle-plus fa-2xl"></i>
                    <input id="fileInput" type="file" required="required" @change="showPreview($event);">
                </label>
            </div>
            <div class="user-box">
                <input type="text" id="dest" required="required" placeholder="Destinataire">
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

export default {
    components : {NavBar}, 
    setup() {
        
    },
    methods:{
        showPreview(event){
            if(event.target.files.length > 0){
                var src = URL.createObjectURL(event.target.files[0]);
                var preview = document.getElementById("file-ip-1-preview");
                preview.src = src;
            }
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