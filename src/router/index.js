import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../Home.vue'
import VideoChat from '../VideoChat.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/home',
            component: Home
        },
        {
            path: '/videochat',
            component: VideoChat,
        }
    ]
})

export default router
