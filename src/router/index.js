import Vue from 'vue'
import Router from 'vue-router';

const routes = [
    {
        path: '/login',
        component: () => import('@/components/auth/signin')
    },
]

Vue.use(Router)
const router = new Router({
    routes
})
console.log('rut', 'router');

export default router;