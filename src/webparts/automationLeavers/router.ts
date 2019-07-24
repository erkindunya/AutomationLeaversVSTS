import VueRouter from 'vue-router';
import Vue from 'vue';
import MainForm from './components/MainForm/MainForm.vue';
import CompletionPage from './components/CompletionPage/CompletionPage.vue';

Vue.use(VueRouter);
const routes = [
    { path: '/1', component: MainForm, name: '1' },
    { path: '/2', component: CompletionPage, name: '2' },
    { path: '*', redirect: '1' }
];

const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 };
    }
});

export default router;