import Vue from 'vue';
import { VueSelect } from 'vue-select';
import PeoplePicker from '../../common/PeoplePicker.vue';
import ListSelect from '../../common/ListSelect.vue';
import { required, maxLength, requiredIf } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import { sp } from '@pnp/sp';
import axios from 'axios';
import VModal from 'vue-js-modal';
import CustomComponentModal  from '../modals/CustomComponentModal.vue';
import BasketCheckModal  from '../modals/BasketCheckPopup.vue';
import * as _ from 'lodash';
import { DigestCache, IDigestCache } from '@microsoft/sp-http';
const now = new Date();
export default Vue.extend({
    name: 'main-form',
    data: () => ({
        formData: {
            computerName: "",
            customComputerName: "",
            isCustomComputerName: false,
            phoneNumber: "",
            projectCode: "",
            reportingUnit: "",
            financialDirector: "",
            hasPO: false,
            fileDataPO: new ArrayBuffer(0),
            fileNamePO: "",
            requestNewSoftware: false,
            newSoftwareName: "",
            software: [],
            newBusinessPartner: "",
            newLicenseInformation: "",
            newNumberOfUsers: "",
            newBusinessCase: "",
            recipientDisplayName: "",
            recipientEmail: "",
            computerForRequester: "",
            timeStamp: new Date().getTime()
        },
        isPublisherPresent: false,
        FDOptions: [],
        currentSoftware: {
            slaSoftwareName: "",
            slaSccmCollectionID: "",
            slaSccmName: "",
            slaCategory: "",
            slaTypeOfLicense: "",
            slaNewPricing: "",
            slaDownloadCentre: "",
            slaSoftwareCentre: "",
            slaPublisher: ""
        },
        computerForRequester: "",
        computerRecipientObj: {
            EntityData: {
                Email: ""
            },
            DisplayText: ""
        },
        computerList: [],
        computerNameMessage : null
    }),
    computed: {
        //below exists so it can be used within "watch"
        selectedReportingUnit() {
            return this.formData.reportingUnit;
        },
        financialDirector: {
            get: function () {
                return this.formData.financialDirector;
            },
            set: function (newValue) {
                this.formData.financialDirector = newValue;
            }
        },
        isSoftwareSelected() {
            return (this.$store.state.softwares === undefined || this.$store.state.softwares.length == 0) ? false : true;
        },
        softwares: {
            get: function () {
                this.currentSoftware = null;
                return this.$store.state.softwares.sort((a, b) => {
                    (a.Publisher !== '' || b.Publisher !== '') ? this.isPublisherPresent = true : this.isPublisherPresent = false;
                    var nameA = a.SoftwareName.toLowerCase(),
                        nameB = b.SoftwareName.toLowerCase();
                    if (nameA < nameB) //sort string ascending
                        return -1;
                    if (nameA > nameB)
                        return 1;
                    return 0; //default return value (no sorting)
                });
            }
        }
    },
    methods: {
        getDefaultFD: function() {

            var reportingUnit = this.formData.reportingUnit.NSSReportingUnit ? this.formData.reportingUnit.NSSReportingUnit : this.formData.reportingUnit;

            sp.site.rootWeb.lists.getByTitle('FinancialDirectors').items.filter("substringof(%27@%27,Title) and NSSReportingUnit eq '" + reportingUnit.replace("&", "%26") + "'").orderBy("NSSReportingUnit").get().then((items: any[]) => {
                this.formData.financialDirector = items[0].Title;
            });

        },
        showCustomComputerName: function () {
            this.formData.isCustomComputerName = !this.formData.isCustomComputerName;
            if (this.formData.isCustomComputerName) {
                this.formData.computerName = "";
            }
        },
        showRequestNewSoftware: function () {
            this.formData.requestNewSoftware = !this.formData.requestNewSoftware;
        },
        submit() {
            if (this.$store.state.softwares.length !== 0 && this.currentSoftware === null) {
                this.formData.software = this.$store.state.softwares;
                this.$store.commit('mainForm', this.formData);
                this.$store.commit('navigate', 2);
            } else {
                console.log(this.currentSoftware);
                this.$modal.show(BasketCheckModal, {
                    text: 'Oops!',
                    Packaged: this.currentSoftware ? this.currentSoftware.slaSoftwareCentre: '',
                    SoftwareName: this.currentSoftware ? this.currentSoftware.slaSoftwareName: '',
                    SccmCollectionID: this.currentSoftware ? this.currentSoftware.slaSccmCollectionID: '',
                    SccmName: this.currentSoftware ? this.currentSoftware.slaSccmName: '',
                    ListColour: this.currentSoftware ? this.currentSoftware.slaCategory: '',
                    TypeOfLicense: this.currentSoftware ? this.currentSoftware.slaTypeOfLicense: '',
                    Cost: this.currentSoftware ? this.currentSoftware.slaNewPricing: '',
                    DownloadCentre: this.currentSoftware ? this.currentSoftware.slaDownloadCentre: '',
                    SoftwareCentre: this.currentSoftware ? this.currentSoftware.slaSoftwareCentre: '',
                    LinkToSCCM: this.currentSoftware ? this.currentSoftware.slaLinkToSoftware: '',
                    Publisher: this.currentSoftware ? this.currentSoftware.slaPublisher : '',
                    Submitted: "IN_PROGRESS"
                },
                {
                    name: 'basket-dynamic-modal',
                    height: 'auto',
                    resizable: true,
                    adaptive: true,
                    draggable: false,
                    scale: true,
                    transition: "nice-modal-fade"
                });
            }
        },
        //list machine names based on whether its for another user or not
        async listMachineNames() {
            this.computerNameMessage = true;
            var computerUserEmail = "";
            this.computerList = [];
            if (this.computerForRequester) {
                await sp.web.currentUser.get().then(result => {
                    this.formData.recipientDisplayName = result.Title;
                    computerUserEmail = result.Email;
                    this.formData.recipientEmail = computerUserEmail;
                });
            } else {
                this.formData.recipientDisplayName = this.computerRecipientObj.DisplayText ? this.computerRecipientObj.DisplayText: "NO_DISPLAY_NAME";
                computerUserEmail = this.computerRecipientObj.EntityData.Email ? this.computerRecipientObj.EntityData.Email : "NO_MAIL";
                this.formData.recipientEmail = computerUserEmail;
            }
            const data = await axios.get("https://kierautomationsoftwareinstallfunctions.azurewebsites.net/api/getComputerNames?code=7i/0COMC26SD4GvjQXansqssELq4vdoGXA3dCR59bWe5JqITD2RMNw==&Email=" + computerUserEmail.toLowerCase());
            if (data.data) {
                data.data.forEach(computerItem => {
                    this.computerList.push(computerItem.ComputerName);
                });
            }
            this.computerNameMessage = false;
        },
        addSoftware() {
            const curSoft = this.currentSoftware.slaSoftwareName;
            const isSoftwareDuplicate = (this.$store.state.softwares.length > 0) ? (this.$store.state.softwares.filter((elem) => {
                if (elem.SoftwareName === curSoft)
                    return elem.SoftwareName;
            }).length > 0) : false;
            if (!isSoftwareDuplicate && curSoft !== '') {
                this.$store.commit('addSoftwareToBasket', {
                    Packaged: this.currentSoftware.slaSoftwareCentre,
                    SoftwareName: this.currentSoftware.slaSoftwareName,
                    SccmCollectionID: this.currentSoftware.slaSccmCollectionID,
                    SccmName: this.currentSoftware.slaSccmName,
                    ListColour: this.currentSoftware.slaCategory,
                    requestNewSoftware: (this.currentSoftware.slaCategory === 'Other')? true: false,
                    TypeOfLicense: this.currentSoftware.slaTypeOfLicense,
                    Cost: this.currentSoftware.slaNewPricing ? this.currentSoftware.slaNewPricing : '',
                    DownloadCentre: this.currentSoftware.slaDownloadCentre,
                    SoftwareCentre: this.currentSoftware.slaSoftwareCentre,
                    LinkToSCCM: this.currentSoftware.slaLinkToSoftware ? this.currentSoftware.slaLinkToSoftware : '',
                    Publisher: this.currentSoftware.slaPublisher ? this.currentSoftware.slaPublisher : '',
                    Submitted: "IN_PROGRESS"
                });
            }
            this.currentSoftware.slaPublisher ? this.isPublisherPresent = true : this.isPublisherPresent = false;
            this.currentSoftware = null;
        },
        removeSoftware(index) {
            this.$store.commit('removeSoftwareFromBucket', index);
        },
        showDynamicComponentModal () {
            this.$modal.show(CustomComponentModal, {
                text: 'Can’t find the software you are looking for?'
            },
            {
                name: 'dynamic-modal',
                height: 'auto',
                resizable: true,
                adaptive: true,
                draggable: false,
                scale: true,
                transition: "nice-modal-fade"
            });
        },
        showWhitelistPopup() {
            this.$modal.show('dialog', {
                title: 'Please note, these items can be installed directly through Software center',
                text: this.$store.state.softwares.filter(item => item.ListColour === "Whitelist (no charge)").map((item) => {
                    return `${item.SoftwareName}`;
                }).join(" ; "),
                buttons: [
                    {
                        title: 'Close'
                    }
                ]
            });
        },
        setPOAttachment( event: Event )
        {
            // Retrieve the file which was selected
            let selectedFile = ( event.srcElement as HTMLInputElement ).files[0];

            // Read the file contents as an ArrayBuffer and store in the instance
            this.getFileArrayBuffer( selectedFile ).then( ( data: ArrayBuffer ) => this.formData.fileDataPO = data );
            this.formData.fileNamePO = selectedFile.name;
        },
        /**
         * Reads a File or Blob and returns its contents as an ArrayBuffer.
         * @param file File or Blob to be returned as an ArrayBuffer.
         */
        getFileArrayBuffer( file: File | Blob ): Promise<ArrayBuffer>
        {
            // Use a Promise to wrap the callbacks
            return new Promise( resolve =>
            {
                let reader = new FileReader();

                // Event raised when the file has been read
                reader.onloadend = () =>
                {
                    // Ensure the file was read successfully
                    if( reader.readyState === reader.DONE )
                    {
                        // Return the file data
                        resolve( reader.result as ArrayBuffer );
                    }
                };

                reader.readAsArrayBuffer(file);
            } );
        },
        async getComputerName(email) {
            const data = await axios.get("https://kierautomationsoftwareinstallfunctions.azurewebsites.net/api/getComputerNames?code=7i/0COMC26SD4GvjQXansqssELq4vdoGXA3dCR59bWe5JqITD2RMNw==&Email=" + email);
            console.log(data);
        }
    },
    created: () => {
        Vue.use(VModal, {
            dialog: true,
            dynamic: true,
            dynamicDefaults: {
              foo: 'foo'
            }
          });
    },
    mounted()
    {
        var items = [];
        sp.site.rootWeb.lists.getByTitle('FinancialDirectors').items.top(2000).get().then((results: any[]) => {

            results.forEach(result => {
                if((result.Title) && !(items.indexOf(result.Title) !== -1))
                    items.push(result.Title);
            });

            Vue.set( this, 'FDOptions', items );

        });
    },
    watch: {
        computerForRequester: function () {
            this.formData.computerName = '';
            this.formData.computerForRequester = this.computerForRequester;
            this.listMachineNames();
            console.log("options:");
            console.log(this.computerList);
        },
        computerRecipientObj: function () {
            this.listMachineNames();
            console.log("options:");
            console.log(this.computerList);
        }
    },
    components: {
        ListSelect,
        VueSelect,
        PeoplePicker
    },
    mixins: [
        validationMixin
    ],
    validations: {
        formData: {
            computerName: {
                required: requiredIf(function () {
                    return !this.formData.isCustomComputerName;
                })
            },
            customComputerName: {
                required: requiredIf(function () {
                    return this.formData.isCustomComputerName;
                })
            },
            fileNamePO: {
                required: requiredIf(function () {
                    return this.formData.hasPO;
                })
            },
            phoneNumber: {
                required
            },
            reportingUnit: {
                required
            },
            financialDirector: {
                required
            },
            newSoftwareName: {
                required: requiredIf(function () {
                    return this.formData.requestNewSoftware;
                })
            },
            newBusinessPartner: {
                required: requiredIf(function () {
                    return this.formData.requestNewSoftware;
                })
            },
            newLicenseInformation: {
                required: requiredIf(function () {
                    return this.formData.requestNewSoftware;
                })
            },
            newNumberOfUsers: {
                required: requiredIf(function () {
                    return this.formData.requestNewSoftware;
                })
            },
            newBusinessCase: {
                required: requiredIf(function () {
                    return this.formData.requestNewSoftware;
                })
            }
        },
        computerRecipientObj: {
            EntityData: {
                Email: {
                    required: requiredIf(function () {
                        return this.formData.isCustomComputerName;
                    })
                }
            }
        }
    }
});
