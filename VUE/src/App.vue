<template>
  <div id="app">
    
   <MainNavbar v-if="user_id !=  null  "/>
    <SecondNavbar v-if="user_id  !=   null  "/>
    <PageHeader v-if="user_id  !=  null  "/>
    <PageBody />
    <!-- <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav> -->

      
    <!-- <router-view /> -->
  </div>
</template>

<script>

import './assets/global/js/core/libraries/jquery.min.js'
import './assets/global/js/core/libraries/bootstrap.min.js'
import './assets/global/js/plugins/loaders/blockui.min.js'
import './assets/global/js/plugins/ui/nicescroll.min.js'
import './assets/global/js/plugins/ui/drilldown.js'

import './assets/global/js/plugins/notifications/pnotify.js'
import './assets/global/js/plugins/notifications/sweet_alert.min.js'
import './assets/global/js/plugins/notifications/jgrowl.min.js'

import './assets/js/app.js'
import { tokenApi } from './assets/custom/custom.js'
import MainNavbar from './components/partials/MainNavbar.vue'
import SecondNavbar from './components/partials/SecondNavbar.vue'
import PageHeader from './components/partials/PageHeader.vue'
import PageBody from './components/partials/PageBody.vue'

export default {
  name: 'app',
  components: {
    MainNavbar,
    SecondNavbar,
    PageHeader,
    PageBody
  },
  data() {
    return {
       user_id: ''
    }
  },
  mounted() {
    this.user_id = tokenApi('token', 'check')
  },
  beforeCreate:  function () {
    if (tokenApi('token', 'check') == null) {
      this.$router.push({ name : 'Login'})
    } else {
      let get_current_url = this.$session.get('get_current_url')
      this.$router.push({ name : get_current_url})
    }
  },
}
</script>


<style >

@import "https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900";
@import "./assets/global/css/icons/icomoon/styles.css";
@import "./assets/css/bootstrap.css";
@import "./assets/css/core.css";
@import "./assets/css/components.css";
@import "./assets/css/colors.css";


</style>

