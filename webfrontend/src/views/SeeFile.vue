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
                        <td>{{ info.de }}</td>
                        <td>{{ info.a }}</td>
                        <td>{{ info.fichier }}</td>
                        <td>{{ info.dateheure }}</td>
                        <td>{{ info.downloadable }}</td>
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
      infos : []
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
  }

}
</script>

<style>
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