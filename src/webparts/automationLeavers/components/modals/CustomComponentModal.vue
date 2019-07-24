<template>
  <div class="container other-software-area">
    <h5>{{text}}</h5>
    <p>Complete the fields below to request your new software.</p>
    <div class="row">
      <div class="form-group col col-12">
        <label>What is the name of the software?</label>
        <input
          type="text"
          class="form-control"
          id="newSoftwareName"
          v-model="modalData.newSoftwareName"
          :class="{ 'is-invalid': $v.modalData.newSoftwareName.$invalid }"
        >
      </div>
      <div class="form-group col col-12">
        <label>Who is your Business Partner?</label>
        <input
          type="text"
          class="form-control"
          id="newBusinessPartner"
          v-model="modalData.newBusinessPartner"
          :class="{ 'is-invalid': $v.modalData.newBusinessPartner.$invalid }"
        >
      </div>
      <div class="form-group col col-12">
        <label>Do you have any licence information?</label>
        <input
          type="text"
          class="form-control"
          id="newLicenseInformation"
          v-model="modalData.newLicenseInformation"
          :class="{ 'is-invalid': $v.modalData.newLicenseInformation.$invalid }"
        >
      </div>
      <div class="form-group col col-12">
        <label>How many users will need this software?</label>
        <input
          type="text"
          class="form-control"
          id="newNumberOfUsers"
          v-model="modalData.newNumberOfUsers"
          :class="{ 'is-invalid': $v.modalData.newNumberOfUsers.$invalid }"
        >
      </div>
      <div class="form-group col">
        <label>Why do you need this software?</label>
        <textarea
          id="newBusinessCase"
          height="100"
          v-model="modalData.newBusinessCase"
        ></textarea>
      </div>
    </div>
    <button type="button" class="btn btn-primary" @click.prevent="cancel">Cancel</button>
    <button type="button" style="float:right !important" class="btn btn-primary" @click.prevent="submit" :disabled="$v.modalData.$invalid">Add To Basket</button>
  </div>
</template>
<style scoped></style>
<script lang="ts">
import Vue from 'vue';
import { sp } from '@pnp/sp';
import { VueSelect } from 'vue-select';
import { debounce } from 'lodash';
import { required, maxLength, requiredIf } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
export default {
  name: 'CustomComponentModal',
  data: () => ({
    modalData: {
        newSoftwareName: "",
        newBusinessPartner: "",
        newLicenseInformation: "",
        newNumberOfUsers: "",
        newBusinessCase: ""
    }
  }),
  props: ['text'],
  methods: {
    cancel() {
      // this.$emit('close');
       this.$modal.hide('dynamic-modal');
    },
    submit() {
        this.$store.commit('addSoftwareToBasket', { 
          SoftwareName : this.modalData.newSoftwareName,
          newSoftwareName : this.modalData.newSoftwareName,
          newBusinessPartner :this.modalData.newBusinessPartner,
          newLicenseInformation : this.modalData.newLicenseInformation,
          newNumberOfUsers: this.modalData.newNumberOfUsers,
          newBusinessCase: this.modalData.newBusinessCase,
          requestNewSoftware: true,
          Cost: '',
          ListColour: "Other"
        });
        this.$store.commit('mainFormModal', this.modalData);
        this.$modal.hide('dynamic-modal');
    }
  },
    mixins: [
        validationMixin
    ],
    validations: {
        modalData: {
            newSoftwareName: {
              required
            },
            newBusinessPartner: {
              required
            },
            newLicenseInformation: {
              required
            },
            newNumberOfUsers: {
              required
            }
        }
    }
};
</script>
<style lang="scss">
@media (max-width:600px)  {
  body {
    padding: 10px;
  }
}
</style>