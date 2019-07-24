<template>
  <div>
    <hr>
    <example-modal/>
    <modals-container />
    <v-dialog/>
      <div>
        <p>
            This form can be used to request all types of software, including both free and licenced software, or to make a business case for new applications that aren’t part of Kier’s existing software library. 
            You can use this form to request software for yourself or for another person (you will need their computer name to complete the request).
            You can also request several applications for the same person on a single form.
        </p>
      </div>
    <h5>Computer Details</h5>
    <div class="form-group">
      <label>Who is this request for?*</label>
      <br>
      <div class="form-check form-check-inline">
        <input
          type="radio"
          id="chkWhoForMyself"
          class="form-check-input"
          v-model="computerForRequester"
          :value="true"
        >
        <label class="form-check-label" for="chkWhoForMyself">Myself</label>
      </div>
      <br>
      <div class="form-check form-check-inline">
        <input
          type="radio"
          id="chkWhoForNotMe"
          class="form-check-input"
          v-model="computerForRequester"
          :value="false"
        >
        <label class="form-check-label" for="chkWhoForNotMe">Someone Else</label>
      </div>
    </div>
    <div v-if="computerForRequester === false" class="form-group">
      <label>Recipient's Email*</label>
      <people-picker v-model="computerRecipientObj" :class="{ 'is-invalid': $v.computerRecipientObj.EntityData.Email.$invalid }"></people-picker>
    </div>
    <div v-if='computerForRequester !== ""'>
      <div class="form-group">
        <label>Computer Name*</label>
        <vue-select
          v-model="formData.computerName"
          :options="computerList"
          :disabled="formData.isCustomComputerName"
          :class="{ 'is-invalid': $v.formData.computerName.$invalid }"
        >
          <template slot="no-options">
            <div v-if="computerNameMessage">Searching...</div>
            <div v-if="!computerNameMessage" @mousedown.stop>No Computers Found For User...</div>
          </template>
        </vue-select>
      </div>
      <div class="text-left">
        <button
          type="button"
          class="btn btn-primary"
          @click.prevent="showCustomComputerName()"
        >{{!formData.isCustomComputerName ? "My computer isn't listed" : "Select computer from list"}}</button>
      </div>
    </div>
    <div v-if="formData.isCustomComputerName == true">
      <br>
      <div class="form-group">
        <label>Please type your computer name here:*</label>
        <input
          type="text"
          maxlength="255"
          class="form-control"
          id="customComputerNameText"
          v-model="formData.customComputerName"
          :class="{ 'is-invalid': $v.formData.customComputerName.$invalid }"
        >
      </div>
    </div>
    <hr>
    <h5>Contact Details</h5>
    <div class="container">
      <div class="row">
        <div class="form-group col-12">
          <label>Phone Number*</label>
          <input
            type="text"
            maxlength="255"
            class="form-control"
            id="phoneNumber"
            v-model="formData.phoneNumber"
            :class="{ 'is-invalid': $v.formData.phoneNumber.$invalid }"
          >
        </div>
      </div>
    </div>
    <hr>
    <h5>Authorisation</h5>
    <div class="form-group">
      <label>Project Code</label>
      <input
        type="text"
        maxlength="255"
        class="form-control"
        id="projectCode"
        v-model="formData.projectCode"
      >
    </div>
    <div class="form-group">
      <label>Reporting Unit*</label>
      <list-select
        v-model="formData.reportingUnit"
        listName="ReportingUnits"
        :isRootLevel="true"
        :label="NSSReportingUnit"
        v-on:input="getDefaultFD"
        :class="{ 'is-invalid': $v.formData.reportingUnit.$invalid }"
      >
        <template slot="option" slot-scope="option">
          <strong>{{ option.NSSReportingUnit }}</strong>
          <br>
          Business Unit: {{ option.NSSBusinessUnit }}
        </template>
      </list-select>
    </div>
    <div class="form-group">
      <label>Financial Director*</label>
      <vue-select
        :options="FDOptions"
        id="financialDirector"
        v-model="formData.financialDirector"
        :class="{ 'is-invalid': $v.formData.financialDirector.$invalid }"
      ></vue-select>
    </div>
    <div class="form-group">
      <div class="form-check form-check-inline">
        <input type="checkbox" class="form-check-input" id="hasPO" v-model="formData.hasPO">
        <label class="form-check-label" for="hasPO">Do you have a PO to attach?</label>
      </div>
    </div>
    <div class="form-group" v-if="formData.hasPO">
      <label>PO Attachment*</label>
      <input type="file" id="poAttachment" style="display:block;" :required="formData.hasPO" accept=".doc,.docx,.xls,.xlsx,.pdf" v-on:change="setPOAttachment">
    </div>
    <hr>
    <h5>Software Basket</h5>
    <div class="form-group">
      <label v-if="!isSoftwareSelected" style="color:#da242a;">Software Basket:</label>
      <label v-if="isSoftwareSelected" style="color:#da242a;"><b>Software Basket:</b></label>
      <table v-if="isSoftwareSelected" class="soft_table">
        <tr>
          <th class="soft_basket_th">Name</th>
          <th v-if="isPublisherPresent" class="soft_basket_th">Publisher</th>
          <th class="soft_basket_th">Cost</th>
          <th class="soft_basket_th">Action</th>
        </tr>
        <tr :id="itemKey" v-for="(item, itemKey) in softwares" :key="itemKey">
          <td class="soft_basket_td">{{item.SoftwareName}}</td>
          <td v-if="isPublisherPresent" class="soft_basket_td"><span v-if="item.Publisher !== ''">{{item.Publisher}}</span></td>
          <td class="soft_basket_td">{{item.Cost}}</td>
          <td class="soft_basket_td_remove">
            <button
                type="button"
                title="Clear selection"
                class="btn btn-primary btn_soft_basket_remove"
                @click.prevent="removeSoftware(itemKey)"
              >
                X
              </button>
          </td>
        </tr>
      </table>
      <table v-if="!isSoftwareSelected" class="soft_table">
      <tr>
        <td>No Item(s) added.</td>
      </tr>
      </table>
      <div class="container">
        <div class="row">
          <div class="col col-12 col-md-9">
            <list-select
              placeholder="Select software..."
              v-model="currentSoftware"
              :isRootLevel="true"
              listName="SLA"
              :lazyLoad="true"
              label="slaSoftwareName"
              :disabled="formData.requestNewSoftware"
              @paste.prevent
            >
              <template slot="option" slot-scope="option">
                <strong>{{ option.slaSoftwareName }}</strong>
              </template>
            </list-select>
          </div>
          <div class="col col-12 col-md-3">
            <button
              type="button"
              class="btn btn-primary btn-software"
              @click.prevent="addSoftware()"
            >Add To Basket</button>
          </div>
        </div>
      </div>
    </div>
    <div class="text-left">
      <a
        href="#"
        @click.prevent="showDynamicComponentModal"
      >{{!formData.requestNewSoftware ? "Can't find the software you are looking for?" : "Request Software From List"}}</a>
    </div>
    <div class="text-right">
      <!-- <button type="button" class="btn btn-primary" @click.prevent="showWhitelistPopup()" :disabled="$v.formData.$invalid">Submit</button> -->
      <button type="button" class="btn btn-primary" @click.prevent="submit" :disabled="$v.formData.$invalid">Next</button>
    </div>
  </div>
</template>
<style scoped src="./MainForm.css"></style>
<script src="./MainForm.js"></script>
