<template>
  <div>
    <nav-bar-home/>
    <img src="../assets/logo1.png" alt="">
    <div class="body-white">
        <div class="txt-descr">
            <div class="section">
                <h2>Résumé de notre projet</h2>
                <p>		Le chiffrement de bout en bout est devenu indispensable ces dernières années. Avec l’augmentation des cyberattaques, les utilisateurs et les citoyens veulent que leurs informations restent privées sur toutes les plateformes où elles sont stockées. Cela est d’autant plus important pour leurs données médicales. En effet, les hôpitaux français ont été sujet à de nombreuses cyberattaques : environ 1,4 million de personnes ont eu leurs données médicales dérobées en 2021
Pour résoudre ce problème, qui met à mal plusieurs hôpitaux, le groupe Cr’Hack a décidé de proposer une solution innovante et sécurisée : Cr’Hack Share. 
Notre site web permettra aux médecins et aux patients d’envoyer des ordonnances et autres documents sensibles en utilisant le chiffrement de bout en bout. 
Nous vous garantissons que vos données personnelles seront chiffrées du moment où vous les envoyer jusqu'à ce qu’elles soient ouvertes chez votre destinataire.
Intuitif et minimaliste, notre site est simple d’utilisation pour tout utilisateur et il ne néglige pas le respect de la vie privée et des données qu’elle renferme. 

            </p>
            <div class="section">
                <h2>Qu'est-ce que le chiffrement de bout en bout ?</h2>
                <p>D’après Kaspersky, le chiffrement de bout en bout «consiste à chiffrer les messages sur un dispositif pour que seul le dispositif auquel il est envoyé puisse le déchiffrer. Le message effectue tout le voyage entre l’expéditeur et le destinataire sous forme chiffrée ». L’adoption de cette méthode par Zoom, Signal et WhatsApp démontre que ce type d’échange devient de plus en plus fréquent, à une époque où la protection de la vie privée est un combat continuel.  

L’avantage du chiffrement de bout en bout réside dans le fait que le message est en claire, donc non chiffré, seulement sur la machine de l’expéditeur et la machine du destinataire. Ainsi si le message est intercepté, il sera illisible. En conséquence, le principal danger réside dans le fait que quelqu’un peut subtiliser les coordonnées de l’un des deux utilisateurs, d’où l’importance de l’authentification.  </p>
            </div>
            </div>
            <div class="section">
                <h2>Pourquoi-nous ?</h2>
                <p>Nous sommes 6 étudiants d’EFREI PARIS, une école d’ingénieur informatique située à Villejuif. Dans le cadre du MasterCamp, un mois où nous sommes plongés dans nos filières respectives, nous avons reçu de la part de GOVI un appel d’offre. Il consistait à établir une plateforme permettant le partage de fichier chiffrés de bout en bout. 
Etant des aspirants en cybersécurité, la protection de la vie privée et surtout des données médicales est pour nous primordiale. Pour ce projet nous avons une ligne directrice : personne ne doit avoir accès à VOS informations à part vous et les personnes que vous avez choisies. 
Nous croyons en un monde où la vie privée sera la priorité de tout le monde comme cela l’est pour nous) Alors, ce projet est pour nous un pas en avant vers ce monde meilleur que nous voulons tous.
</p>
            </div>

        </div>

        
        <div class="container">
            <div class="student Myriam" >
                <img src="../assets/myriam1.jpg" alt="photo de myriam"/>
                <h4>Myriam Amor</h4>

            </div>

            <div class="student Josephine">
                <img src="../assets/josephine2.png" alt="photo de josephine"/>
                <h4>Joséphine de Lestrange</h4>
            </div>

            <div class="student Antoine">
                    <img src="../assets/antoine.png" alt="photo d antoine"/>
                    <h4>Antoine Gay</h4>
             </div>
            
            <div class="student Helene">
                <img src="../assets/helene1.png" alt="photo d helene"/>
                <h4>Helene Huang</h4>
            </div>
            

            <div class="student Ari">
                <img src="../assets/ari1.jpg" alt="photo d ari"/>
                <h4>Ariprakash Ranganadin</h4>
            </div>

                <div class="student Clément">
                    <img src="../assets/clement1.jpg" alt="photo de clement"/>
                    <h4>Clément Rostagni</h4>
                </div>

        
        </div>

    </div>

</template>

<script>
//import SignInVue from './SignIn.vue'
//import SignUpVue from './SignUp.vue'
import NavBarHome from "./navBarHomePage/NavBarHome.vue"

export default {
    name : 'HomePage',
    components:{
        NavBarHome
    },
    setup(){

    }, 
    data(){
        /*return {
            v : false
        }*/
    }, 
    methods : {

        goToSignIn : function (){
            alert("changement de page") 
            this.$router.push({name : 'SignIn'})
        }, 

        goToSignUp : function (){
            alert("changement de page") 
            this.$router.push({name : 'SignUp'})
        }, 

        goToHome : function (){
            alert("changement de page") 
            this.$router.push({name : 'HomePage'})
        }
    }

}
</script>

<style scoped>
    p{
        text-align: left;
    }

    h2{
        color : #2E86AB
    }

    .body-white {
        padding : 2%; 
    }

    .section {
        margin : 3px 0px 3px 0px; 
    }

    .container {
        display:flex ; 
        flex-direction: row;
        flex-wrap: wrap; 
        justify-content: space-evenly;
        align-items: center ; 
    }

    .student{
        /* haut droite bas gauche */ 
        margin : 2% 7% 2% 7% ; 
    }

    img{
        margin-top: 75px;
        width: 200px;
    }


</style>