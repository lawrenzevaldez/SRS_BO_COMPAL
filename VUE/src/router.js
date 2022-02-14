import Vue from 'vue'
import Router from 'vue-router'
import CreateRs from './components/rs/CreateRs.vue'
import BoInquiry from './components/bo_inquiry/BoInquiry.vue'
import RsInquiry from './components/rs_inquiry/RsInquiry.vue'
import RsPickUp from './components/rs_inquiry/RsPickUp.vue'
import RsDetails from './components/rs_inquiry/RsDetails.vue'
import BoDetails from './components/bo_inquiry/BoDetails.vue'

import Login from './components/Login.vue'

Vue.use(Router)
export default new Router ({
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/bo/create_rs',
            name: 'CreateRs',
            component: CreateRs
        },
        {
            path: '/bo/rs_inquiry',
            name: 'RsInquiry',
            component: RsInquiry
        },
        {
            path: '/bo/bo_inquiry',
            name: 'BoInquiry',
            component: BoInquiry
        },
        {
            path: '/bo/rs_inquiry/pickup/:rs_id/:rs_action',
            name: 'RsPickUp',
            component: RsPickUp
        },
        {
            path: '/bo/rs_inquiry/viewDetails/:type/:rs_id',
            name: 'RsDetails',
            component: RsDetails
        },
        {
            path: '/bo/bo_inquiry/viewDetails/:type/:rs_id',
            name: 'BoDetails',
            component: BoDetails
        }
    ]
})