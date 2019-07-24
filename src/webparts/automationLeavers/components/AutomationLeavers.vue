<template>
  <div id="app-automation-forms" class="container">
    <header class="row">
          <div class="col">
              <img src="../logo.jpg" alt="Kier">
          </div>
      </header>
      <div class="row main-body">
          <div class="col">
              <h1>Software Request Form</h1>
              <div v-if="!submitted && !submitting">
                <transition>
                  <keep-alive>
                    <router-view></router-view>
                  </keep-alive>
                </transition>
              </div>
              <div v-if="submitting">
                Submitting
              </div> 
              <div v-if="submitted">
                <!-- <span><img class="smlIcon" src="../tick.jpg"><p class="successText">Your request has been successfully submitted, you will receive an email containing the ticket reference number shortly.</p></span>
                <br /> -->
                <p><strong>What's Next?</strong></p>
                <p><strong>Thank you for using this service. Please be aware that a new ticket will be raised for each piece of software selected.</strong></p>
                <br/><br/><button type="button" onclick="window.location.href='http://myservicedesk/portal.php'" class="btn btn-secondary" >Close</button>
              </div>
          </div>
      </div>
  </div>
</template>

<style src="./AutomationLeavers.css"></style>
<script src="./AutomationLeavers.js"></script>