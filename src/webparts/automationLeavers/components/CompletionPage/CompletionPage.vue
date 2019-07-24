<template>
  <div>
    <h5>Order Summary</h5>
    <div class="form-group">
      <p>Please review the details below and if everything is correct, please click submit.</p>
    </div>
    <div v-if="unpackagedSoftware">
        <p><strong>The below software will be installed within 24 hours assuming you have an internet connection.</strong></p> 
        <ul>
            <li v-for="(item, itemKey) in filteredSoftwareList('unpackaged')" :key="itemKey">{{item.SoftwareName}}</li>
        </ul>
    </div>
    <div v-if="manualInstallSoftware">
        <p><strong>Someone from our Service Desk team will be in touch to install the below software.</strong></p> 
        <ul>
            <li v-for="(item, itemKey) in filteredSoftwareList('manualInstall')" :key="itemKey">{{item.SoftwareName}}</li>
        </ul>
    </div>
    <div v-if="packagedSoftware">
        <p><strong>The below software is available in Software Centre for you to install yourself. </strong><strong v-if="requesterCurrentUser">You will need to click on the link(s) below to install them.</strong></p> 
        <ul>
            <li v-for="(item, itemKey) in filteredSoftwareList('packaged')" :key="itemKey">{{item.SoftwareName}}
              <a class="linkFloatRight imageHover" v-if="requesterCurrentUser" @click.prevent="install(item.LinkToSCCM)"><span>Open in Software Centre </span><img class="imageHover" border="0" alt="Open in Software Centre" title="Open in Software Centre" src="../../linkIcon.jpg"></a>
            </li>
        </ul>
    </div>
    <div v-if="redListSoftware">
        <p><strong>The below software does not adhere to Kier policies and cannot be installed at this time.</strong></p> 
        <ul>
            <li v-for="(item, itemKey) in filteredSoftwareList('redList')" :key="itemKey">{{item.SoftwareName}}</li>
        </ul>
    </div>
    <div v-if="greenListSoftware">
        <p><strong>Once approved by your Financial Director, the below software requires purchasing. Please monitor your ticket reference via the portal for updates.</strong></p> 
        <ul>
            <li v-for="(item, itemKey) in filteredSoftwareList('greenList')" :key="itemKey">{{item.SoftwareName}}</li>
        </ul>
    </div>
    <div v-if="otherListSoftware">
        <p><strong>The below software will be reviewed by Contracts and Licencing. Please monitor your ticket reference via the portal for updates.</strong></p> 
        <ul>
            <li v-for="(item, itemKey) in filteredSoftwareList('otherList')" :key="itemKey">{{item.SoftwareName}}</li>
        </ul>
    </div>
    <hr>
    <div class="row">
        <div class="col">
            <button type="button" class="btn btn-secondary" @click.prevent="back">Back</button>
        </div>
        <div class="col text-right">
             <button type="button" class="btn btn-primary" @click.prevent="submit()">Submit</button>
        </div>
    </div>
  </div>
</template>
<style scoped src="./CompletionPage.css"></style>
<script src="./CompletionPage.js"></script>
