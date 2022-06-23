<template>
    <div class="container">
        <div class="title">Formulaire d'envoi chiffré</div>
        <div id="form">
            <div class="input-container">
                <input type="file" name="secret file" id="file">
            </div>
            <div class="file-container">
                <input id="id-receiver" class="input" type="text">
                <div class="cut"></div>
                <label for="recipient">Recipient</label>
            </div>
        </div>
        <button id='btn-confirmer' type="submit">Confirmer</button> 
        <button id='btn-annuler' type="submit">Annuler</button>
        
    </div>
</template>

<script>
export default {
    setup() {
        
    },
}
</script>

<style scoped>
.container{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,.5);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgba(0,0,0,.6);
}

.title{
    margin: 0 0 3px;
    padding: 0;
    color: #fff;
    text-align: center;

}


#form{
    background-color: #C1C1C1;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

</style>