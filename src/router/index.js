import Vue from 'vue'
import Router from 'vue-router';

const routes = [
    {
        path: '/login',
        component: () => import('@/components/auth/signin')
    },
    {
        path: '/notes',
        component: () => import('@/components/notes')
    },
    {
        path: '*',
        redirect: '/login',
    }
]

Vue.use(Router)
const router = new Router({
    routes
})

router.beforeEach((to, from, next) => {
    if(from.path === '/login'){
        if (to.path === '/notes'){
            next();
        }
    } else if (from.path === '/') {
        if(to.path === '/login'){
            next();
        } else if (to.path === '/notes') {
            // check is logged in or not
            let sessionActive = localStorage.getItem('session')
            if (sessionActive) {
                next();
            } else {
                next({
                    path: '/login',
                    query: { redirect: to.path }
                })
            }
        }
    }
})

export default router;