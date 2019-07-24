<template>
  <div class="container other-software-area">
    <h5>{{text}}</h5>
    <div v-if="SoftwareName != ''">
      <p><b>{{SoftwareName}}</b> has been selected but you have not added it to your basket. Would you like to add this item to your basket? </p>
          <button type="button" class="btn btn-primary btn_primary_popup" @click.prevent="cancel">No</button>
          <button type="button" class="btn btn-primary btn_primary_popup" @click.prevent="submit">Yes</button>
    </div>
     <div v-if="SoftwareName == ''">
       <p>Please ensure at least one piece of software is selected before proceeding to the next page.</p>
       <button type="button" class="btn btn-primary btn_primary_popup" @click.prevent="cancel">Close</button>
     </div>
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
  name: 'BasketCheckModal',
  data: () => ({
  }),
  props: ['text','Packaged','SoftwareName','SccmCollectionID','SccmName','ListColour','TypeOfLicense','Cost','DownloadCentre','SoftwareCentre','LinkToSCCM', 'Publisher','Submitted'],
  methods: {
    cancel() {
      this.$emit('close');
    },
    submit() {
      this.$store.commit('addSoftwareToBasket', {
          Packaged: this.Packaged,
          SoftwareName: this.SoftwareName,
          SccmCollectionID: this.SccmCollectionID,
          SccmName: this.SccmName,
          ListColour: this.ListColour,
          TypeOfLicense: this.TypeOfLicense,
          Cost: this.Cost,
          DownloadCentre: this.DownloadCentre,
          SoftwareCentre: this.slaSoftwareCentre,
          LinkToSCCM: this.LinkToSCCM,
          Publisher: this.Publisher,
          Submitted: "IN_PROGRESS"
      });
      this.$modal.hide('basket-dynamic-modal');
    }
  },
    mixins: [
        validationMixin
    ],
    validations: {

    }
};
</script>
<style lang="scss">
</style>