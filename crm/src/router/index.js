import Vue from 'vue'
import VueRouter from 'vue-router'
import { getAuth } from "firebase/auth";


Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        meta: {layout: 'empty'},
        component: () => import('../views/Login')
    },
    {
        path: '/register',
        name: 'register',
        meta: {layout: 'empty'},
        component: () => import('../views/Register')
    },
    {
        path: '/',
        name: 'home',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/Home')
    },
    {
        path: '/categories',
        name: 'categories',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/Categories')
    },
    {
        path: '/detail-record',
        name: 'detail-record',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/DetailRecord')
    },
    {
        path: '/history',
        name: 'history',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/History')
    },
    {
        path: '/planning',
        name: 'planning',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/Planning')
    },
    {
        path: '/profile',
        name: 'profile',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/Profile')
    },
    {
        path: '/record',
        name: 'record',
        meta: {layout: 'main', auth: true},
        component: () => import('../views/Record')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) =>{
    const auth = getAuth();
    const user = auth.currentUser;
    const reqiureAuth = to.matched.some(r => r.meta.auth)

    if (reqiureAuth && !user) {
        next('/login?message=login')
    } else {
        next();
    }
})
export default router
