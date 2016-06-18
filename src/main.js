import style from './assets/stylesheets/chatroom.css'

import Vue from 'vue'
import App from './app.vue'
import VueSocketio from 'vue-socket.io';
import config from '../config';

let filter = require('./filter')
Object.keys(filter).forEach(k => Vue.filter(k, filter[k]))

Vue.use(VueSocketio, 'http://' + config.server.host + ':' + config.server.port)

new Vue({
    el: 'body',
    components: { App }
})
