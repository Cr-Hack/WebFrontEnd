import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
//import Vue from 'vue';
//import Vuex from 'vuex';

import '@fortawesome/fontawesome-free/js/all'
//import store from './store'


//Vue.use(Vuex)
/*
const jwt = require("jsonwebtoken")
const express = require("express")
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true }))

// charge la librairie 
require("dotenv").config
//pour avoir accès à la variable : 
//process.env.ACCESS_TOKEN_SECRET 

const user = {
    id : 42, 
    name : "Jean Bon ",
    email : "j@gmail.com", 
    admin : true,  
}

function generateAccessToken(user){
    // expire in : 1800S -> durée : 30 min 
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn : '1800s'})
}

const accessToken = generateAccessToken(user)*/
/*const store = new Vuex.store(
    {
        state : {
            count : 0
        }, 
        mutations : {
            increment (state){
                state.count ++ 
            }
        }
    }
)*/

createApp(App).use(router).mount('#app')
