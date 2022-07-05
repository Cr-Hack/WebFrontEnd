<template>
<div class="footer">
    <footer>
        <h4 class="txt-footer">© 2022 Cr'Hack</h4>
    </footer>
</div>
</template>

<script>
export default {
    name : 'FooterVue', 

}
</script>

<style>
    .footer{
        position: relative;
        min-height: 460px;
    }
    footer {
        position: sticky;
        top: 100%;
    }


    .txt-footer{
        color: #922d50;
        font-weight: lighter;
        height: auto;
    }

</style>