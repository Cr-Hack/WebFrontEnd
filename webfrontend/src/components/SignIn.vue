<template>
    <h2>
        ceci est la page pour se connecter. 
    </h2>

    <div class="container3">
        <form action="" method="post">

            <div class="input-group">
                <input type="email" name="email" id="" placeholder="Email" required>
            </div>
            <div class="input-group">
                <input type="password" name="pwd" id="" placeholder="Mot de passe" required>
            </div>
            <div class="input-group-btn">
                <button class="btn" type="submit">Se connecter</button>
            </div>
        </form>
    </div>

</template>

<script>
export default {
    name : "SignIn", 
    setup(){

    }

}
</script>

<style>

    .container3{
        padding : 2% ;
    }

    .container3 .input-group {
        width: 75%;
        height: 50px;
        margin-bottom: 5%;
    }

    .container3 .input-group input {
        width: 100%;
        height: 100%;
        border: 2px solid #2e86ab;
        padding: 15px 20px;
        font-size: 1rem;
        border-radius: 30px;
        transition: .3s;
    }

    .container3 .input-group input:focus,
    .container3 .input-group input:valid {
        border-color: #2e86ab;
    }

    .container3 .input-group-btn{
        height: 50px;
        margin-bottom: 3%;
    }

    .container3 .input-group-btn .btn {
        display: block;
        width: 50%;
        padding: 2% 2%;
        text-align: center;
        border: none;
        background: #2e86ab;
        outline: none;
        border-radius: 30px;
        font-size: 1.2rem;
        color: #FFF;
        cursor: pointer;
        transition: .3s;
        margin-bottom: 3%;
    }

    .container3 .input-group-btn .btn:hover {
        transform: translateY(-5px);
        background: #266e8d;
    }


</style>