<template>
  <nav-bar/>
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
                <td>{{info.de}}</td>
                <td>{{info.a}}</td>
                <td>{{info.fichier}}</td>
                <td>{{info.dateheure}}</td>
                <td v-if="getData(index)"><button><i class="fa-solid fa-download"></i></button></td>
                
            </tr>
        </tbody>
    </table>
  
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from './sidebar/NavBar.vue'

export default {
  components : {NavBar}, 

  data(){
    return{
      infos : [],
    }
  },
  async created(){
    axios.get('http://localhost:3000')
    .then((response) => {
      this.infos = response.data
    })
    .catch((err) => {
      console.log(err)
    })
  },
  methods:{
    getData: function(index) {
        if (this.infos[index].downloadable==true){
          return true;
        }
        return false;
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