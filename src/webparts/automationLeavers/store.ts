import Vuex from 'vuex';
import Vue from 'vue';
import { sp } from '@pnp/sp';
import router from './router';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        main: {},
        modal: {},
        softwares: [],
        page: 1,
        maxPage: 1,
        submitting: false,
        submitted: false,
        submissionTimeStamp: ""
    },
    mutations: {
        mainForm(state, values) {
            state.main = values;
        },
        mainFormModal(state, values) {
            state.modal = values;
        },
        addSoftwareToBasket(state,values) {
            state.softwares.push(values);
        },
        removeSoftwareFromBucket(state,index){
            state.softwares.splice(index, 1);
        },
        navigate(state, page) {
            state.page = page;
            if(page > state.maxPage) state.maxPage = page;
            router.push(`/${page}`);
        },
        formSubmitting(state) {
            window.scrollTo (0,0);
            state.submitting = true;
        },
        formSubmitFailed(state) {
            console.log(state);
            var requestJSON = JSON.stringify(state);
            sp.web.lists.getByTitle("FailedSubmissions").items.add({
                Title: "Failed submission",
                FormJSON: requestJSON
            }).then(i => {
                console.log("Submission failed");
            }).catch(e => {
                console.log(e);
            });
        },
        formSubmitted(state) {
            state.submitted = true;
            state.submitting = false;
        },
        checkSoftwareUploaded(state) {
            const main: any = state.main;
            var remainingItems = main.software.filter(item => item.Submitted === "IN_PROGRESS");
            if(remainingItems.length == 0) {
                console.log("Completed");
                state.submitted = true;
                state.submitting = false;
            } else {
                console.log("Still in progress");
            }
        },
        setSubmissionTime(state, submissionTimeStamp) {
            state.submissionTimeStamp = submissionTimeStamp;
        }
    },
    actions: {
        submitForm({ commit, state }) {
            commit('formSubmitting');
            const main: any = state.main;
            console.log(main.software);
            console.log(state.submissionTimeStamp);
            main.software.forEach((element) => {
                sp.web.lists.getByTitle("SoftwareInstallSubmissions").items.add({
                    // main page
                    ComputerName: (main.computerName.trim() === '')?main.customComputerName.trim(): main.computerName.trim(),
                    IsCustomComputerName: main.isCustomComputerName,
                    PhoneNumber: main.phoneNumber.trim(),
                    ProjectCode: main.projectCode.trim(),
                    SoftwareName: (element.newSoftwareName)? element.newSoftwareName: element.SoftwareName,
                    SCCMCollectionID: element.SccmCollectionID,
                    SCCMName: element.SccmName,
                    ListColour: element.ListColour,
                    TypeOfLicense: element.TypeOfLicense,
                    Cost: element.Cost,
                    DownloadCentre: element.DownloadCentre,
                    SoftwareCentre: element.SoftwareCentre,
                    ReportingUnit: main.reportingUnit.Title,
                    FinancialDirector: main.financialDirector,
                    HasPO: main.hasPO,
                    RequestNewSoftware: element.requestNewSoftware,
                    NewSoftwareName: element.newSoftwareName? element.newSoftwareName.trim(): "",
                    NewBusinessPartner: element.newBusinessPartner? element.newBusinessPartner.trim(): "",
                    NewLicenseInformation: element.newLicenseInformation? element.newLicenseInformation.trim(): "",
                    NewNumberOfUsers: element.newNumberOfUsers? element.newNumberOfUsers.trim(): "",
                    NewBusinessCase: element.newBusinessCase? element.newBusinessCase.trim(): "",
                    RecipientDisplayName: main.recipientDisplayName,
                    RecipientEmail: main.recipientEmail.trim(),
                    SubmissionTime: state.submissionTimeStamp,
                    CreationDate: new Date()
                }).then( result => {

                    // Check whether a purchase order was provided
                    if( result.data.HasPO )
                    {
                        // Upload the purchase order file as an attachment to the new list item
                        result.item.attachmentFiles.add( main.fileNamePO, main.fileDataPO ).then( v => console.dir( v ) ).catch( e => console.dir( e ) );
                    }

                    element.Submitted = "SUCCESS";
                    console.log(element.SoftwareName);
                    commit("checkSoftwareUploaded");
                }).catch(e => {
                    element.Submitted = "FAILED";
                    console.log(element.SoftwareName);
                    commit("checkSoftwareUploaded");
                    commit("formSubmitFailed");
                });
            });
        }
    }
});