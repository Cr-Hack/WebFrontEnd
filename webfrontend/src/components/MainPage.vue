<template>
<img id="logo" src="../assets/CrhackLogo.png" alt="Yes"><br><br>
<button @click="v = false">Sendfile</button>
<button @click="v = true">Seefile</button>
<div v-if="v === false">
<send-file/>
</div>
<div v-else>
<see-file/>
</div>


</template>

<script>
import SeeFile from './SeeFile.vue'
import SendFile from './SendFile.vue'
export default {
  components: { SeeFile, SendFile },
    setup() {
        
    },
    data() {
        return {
            v : false
        }
    },
    methods:{
    }
}
</script>


<style scoped>
#logo{
    width: 100px;
    border-radius: 50px;
}

</style>