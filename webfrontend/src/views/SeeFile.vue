<template>
  <div>
    <table>
        <thead>
            <tr>
                <th>De___</th>
                <th>A___</th>
                <th>Fichier___</th>
                <th>Date/heure___</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="info of infos" :key="info.id">
                <td>{{info.de}}</td>
                <td>{{info.a}}</td>
                <td>{{info.fichier}}</td>
                <td>{{info.dateheure}}</td>
            </tr>
        </tbody>
    
    
    </table>
  
  </div>
</template>

<script>
import axios from 'axios'
export default {

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

</style>