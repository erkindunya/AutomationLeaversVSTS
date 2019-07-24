import Vue from 'vue';
import { VueSelect } from 'vue-select';
import PeoplePicker from '../../common/PeoplePicker.vue';
import ListSelect from '../../common/ListSelect.vue';
import { required, maxLength, requiredIf } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import { sp } from '@pnp/sp';
import axios from 'axios';
import VModal from 'vue-js-modal';
const now = new Date();
export default Vue.extend({
    computed: {
        main() {
            return this.$store.state.main;
        },
        packagedSoftware() {
            const packagedItems =  this.$store.state.main.software.filter(item => (item.LinkToSCCM !== "") && (item.ListColour !== "Red (not permitted)") &&  (item.ListColour !== "Green (Purchasable)") && (item.ListColour !== "Other")) ;
            return (packagedItems.length > 0) ? true : false;
        },
        unpackagedSoftware() {
            const unpackagedItems =  this.$store.state.main.software.filter(item => (item.SccmCollectionID !== "" && item.SccmCollectionID !== null) && (item.LinkToSCCM === "") && (item.ListColour !== "Red (not permitted)") &&  (item.ListColour !== "Green (Purchasable)") && (item.ListColour !== "Other"));
            return unpackagedItems.length > 0 ? true : false;
        },
        manualInstallSoftware() {
            const manualInstallItems =  this.$store.state.main.software.filter(item => (item.SccmCollectionID === "" || item.SccmCollectionID === null) && (item.LinkToSCCM === "") && (item.ListColour !== "Red (not permitted)") &&  (item.ListColour !== "Green (Purchasable)") && (item.ListColour !== "Other"));
            return manualInstallItems.length > 0 ? true : false;
        },
        redListSoftware() {
            const redListItems =  this.$store.state.main.software.filter(item => item.ListColour === "Red (not permitted)");
            return redListItems.length > 0 ? true : false;
        },
        greenListSoftware() {
            const greenListItems =  this.$store.state.main.software.filter(item => item.ListColour === "Green (Purchasable)");
            return greenListItems.length > 0 ? true : false;
        },
        otherListSoftware() {
            const otherListItems =  this.$store.state.main.software.filter(item => item.ListColour === "Other");
            return otherListItems.length > 0 ? true : false;
        },
        requesterCurrentUser(){
            return (this.$store.state.main.computerForRequester == true) ? true : false;
        }
    },
    methods: {
        back() {
            this.$store.commit('navigate', 1);
        },
        submit() {
            this.$store.commit('setSubmissionTime', this.getSubmissionTime());
            this.$store.dispatch('submitForm');
        },
        getSubmissionTime() {
            const submissionTimeStamp =  new Date().getTime();
            const submissionTime = Math.abs(this.main.timeStamp - submissionTimeStamp);
            const hours = Math.floor(submissionTime / 3600000); // 1 Hour = 36000 Milliseconds
            const minutes = Math.floor((submissionTime % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
            const seconds = Math.floor(((submissionTime % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
            return ((hours !== 0 )? `${hours} hours : ` : "") + ((minutes !== 0 )? `${minutes} minutes : ` : "") + `${seconds} seconds`;
        },
        filteredSoftwareList(listType) {
            switch(listType) {
                case "packaged":
                    return this.$store.state.main.software.filter(item => (item.LinkToSCCM !== "") && (item.ListColour !== "Red (not permitted)") && (item.ListColour !== "Green (Purchasable)") && (item.ListColour !== "Other"));
                case "unpackaged":
                    return this.$store.state.main.software.filter(item => (item.SccmCollectionID !== "" && item.SccmCollectionID !== null) && (item.LinkToSCCM === "") && (item.ListColour !== "Red (not permitted)") && (item.ListColour !== "Green (Purchasable)") && (item.ListColour !== "Other"));
                case "manualInstall":
                    return this.$store.state.main.software.filter(item => (item.SccmCollectionID === "" || item.SccmCollectionID === null) && (item.LinkToSCCM === "") && (item.ListColour !== "Red (not permitted)") && (item.ListColour !== "Green (Purchasable)") && (item.ListColour !== "Other"));
                case "redList":
                    return this.$store.state.main.software.filter(item => item.ListColour === "Red (not permitted)");
                case "greenList":
                    return this.$store.state.main.software.filter(item => item.ListColour === "Green (Purchasable)");
                case "otherList":
                    return this.$store.state.main.software.filter(item => item.ListColour === "Other");
                default:
                    return [];
            }
        },
        install(link:string) {
            window.location.href = link;
        }
    },
    created: () => {
        Vue.use(VModal, { dialog: true });
    },
    watch: {
    },
    components: {
        ListSelect,
        VueSelect,
        PeoplePicker
    },
    mixins: [
        validationMixin
    ]
});
