import Vue from 'vue';
import MainForm from './MainForm/MainForm.vue';

export default Vue.extend({
    name: 'app',
    computed: {
        page(): number {
            return this.$store.state.page;
        },
        maxPage(): number {
            return this.$store.state.maxPage;
        },
        submitted() {
            return this.$store.state.submitted;
        },
        submitting() {
            return this.$store.state.submitting;
        }
    },
    methods: {
        navigate (page: number) {
            if(page <= this.page)
                this.$store.commit('navigate', page);
        },
    },
    components: {
        MainForm
    }
});