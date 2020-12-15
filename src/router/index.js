import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import VideoChat from '../views/VideoChat.vue'
import Todo from '../views/Todo'
import UserView from "../views/UserView";

Vue.use(VueRouter)

export const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/home/:id',
            component: UserView
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
