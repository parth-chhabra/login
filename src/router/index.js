import Vue from 'vue';
import Router from 'vue-router';

import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import SignUp from '../components/SignUp.vue';

Vue.use(Router);

const router = new Router({
	base: '/',
	mode: 'history',
	scrollBehavior: () => ({y: 0}),
	routes: [
		{
			path: '/',
			component: Home,
			name: 'Home',
		},
		{
			path: '/login',
			component: Login,
			name: 'Login',
        },
        {
			path: '/signup',
			component: SignUp,
			name: 'SignUp',
		},
	],
});

export default router;
