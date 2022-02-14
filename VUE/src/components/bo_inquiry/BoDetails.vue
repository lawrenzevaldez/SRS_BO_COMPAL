<template>
    
   <div class="panel-body">
        <!-- Main content -->
        <div class="content-wrapper  col-sm-12">
            <button class="btn btn-info btn-sm" v-on:click="redirectPrevious()">BACK</button><h4> {{ headers.toUpperCase() }} </h4>
            <div class="card">
                <div class="card-header header-elements-inline">
                    <h5 class="card-title">{{ title.toUpperCase() }}</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Supplier: {{ supplierName }} <br>
                                        Date: {{ rsDate }} <br>
                                        Status: {{ status }}  <br>
                                        {{ rsActionName }} {{ rsMovementNo }}  <br></b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">ITEM DETAILS</h5>
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Item(s)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, i) in rsHeader" :key="i">
                                    <td>
                                        <b>
                                        Product: {{ row.item_name }} <br>
                                        Qty: {{ row.qty }} <br>
                                        UOM: {{ row.uom }}  <br>
                                        Price: {{ row.price | money }} <br> </b>
                                    </td>
                                    <td>
                                        <b>Amount: {{ row.qty * row.price | money }} </b>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><b>{{ total_price(rsHeader) | money }}</b></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>
<script>

</script>
<script>
import axios from 'axios'
import moment from 'moment'
import { msgError, msgSuccess, tokenApi } from './../../assets/custom/custom.js'
import { async } from 'q'

export default {
    data (){
        return {
            rs_id: '',
            type: '',
            title: '',
            headers: '',
            rsActionName: '',
            rsDate: '',
            rsMovementNo: '',
            rsHeader : [],
            status: '',
            supplierName: '',
            totalPrice: 0,
            hiddenVal: false,
        }
    },
    created() {
        this.rs_id  = this.$route.params.rs_id
        this.type   = this.$route.params.type
    },
    computed: {
         message(){
             return this.$store.getters.message
         }
    },
    async mounted(){
        await this.getFormDetails()
    },
    methods: {
        async handdleError(error=null) {
            if (error != null) {
                const response  = JSON.parse(JSON.stringify(error))
                const status    = response.response.status.toString()
                const message   = (response.response.data.error === undefined) ? response.response.data.message : response.response.data.error.message
                msgError(status, message)
                return true
            }
                msgError(401, "Something Wrong")
        },
        async redirectPrevious() {
            this.$router.push({ name: 'BoInquiry' })
        },
        async getFormDetails() {
            let query = { 
                params: {
                    rs_id: this.$route.params.rs_id,
                    type: this.$route.params.type,
                    user_id: this.$session.get('user_id')
                },
                headers: tokenApi('token', 'header')
            }

            let result          =   await axios.get(apiUrl+'purchaser/inquiry_rs/getDetails', query)
            let data            =   result.data
            this.headers        =   data.headers
            this.rsActionName   =   data.rsActionName
            this.rsDate         =   data.rsDate
            this.rsMovementNo   =   data.rsMovementNo
            this.rsHeader       =   data.rsheader
            this.status         =   data.status
            this.supplierName   =   data.supplierName
            this.title          =   data.title
        },
        total_price(values){
            return values.reduce((acc, val) =>{
                return acc + parseFloat(val.price * val.qty)
            }, 0)
        },
    }
}

</script>


<style scoped>
input {
  border-radius: 0px !important;
   font-size: 10px !important;
   text-align:center ;
}
select{
    border-radius: 0px !important;
    text-align-last:center;
}
.btn {
    border-radius: 0px;
}
th,td {
  padding: 10px !important;
  font-size: 10px;
  text-align: center !important;
}
</style>

