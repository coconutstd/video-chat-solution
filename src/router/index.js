import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../Home.vue'
import VideoChat from '../VideoChat.vue'
import Todo from '../Todo'

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
        },
        {
            path: '/todos',
            component: Todo,
        }
    ]
})

export default router
