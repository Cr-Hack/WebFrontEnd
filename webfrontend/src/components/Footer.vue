<template>
    <div>
        <div class="footer">
            <footer>
                <h4 class="txt-footer">© 2022 Cr'Hack</h4>
            </footer>
        </div>
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
        bottom: 0;
        width : 100% ; 

    }

    footer {
        /*position: sticky;
        top: 100%;*/
        background-color: #f7b32b ;
    }


    .txt-footer{
        color: #922d50;
        font-weight: lighter;
        height: auto;
        margin : 0% ; 
        padding : 1% ;
    }

</style>