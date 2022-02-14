<template>
    
   <div class="panel-body">
        <!-- Main content -->
    <div class="content-wrapper  col-sm-12">
        <div class="panel panel-flat">
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Supplier</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td >
                                <input type="text" class="form-control" placeholder="RS #" v-model="p_rsno" v-on:keyup.13="fetch_list_request"> <br>
                                <p v-show="loading_supplier" class="pull-center" >
                                    <i class="icon-spinner4 spinner position-left"></i> PLEASE WAIT ..
                                </p>
                                <select v-show="!loading_supplier" class="form-control" v-model="p_supplier" style="text-align:center !important;">
                                    <option value="">  -- SELECT SUPPLIER --  </option>
                                    <option v-bind:value="row.vendorcode" v-for="(row, i) in list_supplier" :key="i"> {{ row.description }}</option>
                                </select>
                                <label for="dateFrom" style="margin-top:10px;">Date From</label>
                                <input type="date" v-model="dateFrom" class="form-control" name="dateFrom">
                                <label for="dateTo" style="margin-top:10px;">Date To</label>
                                <input type="date" v-model="dateTo" class="form-control" name="dateTo">
                            </td>
                            <td>
                                <button class="btn btn-info btn-xs" v-on:click="fetch_list_request()"><i class="icon-search4"></i></button> 
                            </td>
                        </tr>
                        <tr v-for="(row, i) in list_request" :key="i">
                            <td>
                                <b>BO #: <a href="#" v-on:click="boDetails(1,row.rs_id)" >{{ row.rs_id }}</a><br>
                                DATE: {{ row.rs_date | date }}<br>
                                SUPPLIER: {{ row.supplier_code }} <br>
                                <span v-if="row.rs_action == '1' && row.processed_by != '0'">
                                    STATUS: RETURNED |<a href="#" v-on:click="boDetails(2,row.rs_id)"> R2SSA # {{ row.movement_no }} </a>| {{ row.rs_date | date }}  <br>
                                </span>
                                <span v-if="row.rs_action == '2' && row.processed_by != '0'">
                                    STATUS: DISPOSED |<a href="#" v-on:click="boDetails(2,row.rs_id)"> FDFB # {{ row.movement_no }} </a>| {{ row.rs_date | date }} <br>
                                </span>
                                <span v-if="row.rs_action != '0' && row.processed_by != '0'">
                                    <a href="#" v-on:click="print_rs(row.rs_id,0)"> Supplier Copy |</a>
                                    <a href="#" v-on:click="print_rs(row.rs_id,1)"> Warehouse Copy |</a>
                                    <a href="#" v-on:click="print_rs(row.rs_id,2)"> Accounting Copy </a> <br>
                                </span>
                                CREATED BY: {{ row.created_by }} <br>
                                PROCESSED BY: {{ row.processed_by }} <br></b>
                            </td>
                            <td>
                                {{ (row.approved === 0) ? 'FOR APPROVAL' : 'APPROVED BY ' }} {{ (row.picked_up === null && row.approved === 0) ? "" : row.approved_by_aria_user }}
                            </td>
                            <!-- <td hidden><input type="hidden" v-bind:name="'supplier_code'+ i" v-bind:value="row.supplier_code"></td> -->
                        </tr>
                    </tbody>
                </table>
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
           p_rsno: '',
           p_supplier: '',
           dateFrom: '',
           dateTo: '',
           branchCode: '',
           list_supplier: [],
           list_request: [],
           loading_supplier: false,
        }
    },
    computed: {
         message(){
             return this.$store.getters.message
         }
    },
    async mounted(){
        await this.fetch_list_supplier(),
        await this.fetch_list_request()
    },
    methods: {
        async fetch_list_supplier() {
            this.loading_supplier = true //activate loading
            try {
                let query = {
                    headers: tokenApi('token', 'header')
                }
                let result = await axios.get(apiUrl+'purchaser/inquiry_rs/fetch_list_supplier', query)
                let data   = result.data
                this.list_supplier = data.supplier

            } catch (error) {
                await this.handdleError(error)
            }
            this.loading_supplier = false //deactivate loading
        },
        async fetch_list_request() {
            try {
                let brCode = (this.branchCode == undefined) ? '' : this.branchCode
                let datas = {
                    params: {
                        dateFrom: this.dateFrom,
                        dateTo: this.dateTo,
                        supplierCode: this.p_supplier,
                        status: 3,
                        rsId: this.p_rsno,
                        rs_action: 2,
                    },
                    headers: tokenApi('token', 'header')
                }
                let result = await axios.get(apiUrl+'purchaser/inquiry_rs/getListRequest', datas)
                let data = result.data
                console.log(data.listRequest)
                this.list_request = data.listRequest
            } catch (error) {
                await this.handdleError(error)
            }
        },
        async handdleError(error=null) {
            if (error != null) {
                const response = JSON.parse(JSON.stringify(error))
                const status = response.response.status.toString()
                const message = (response.response.data.error === undefined) ? response.response.data.message : response.response.data.error.message
                msgError(status, message)
                return true
            }
                msgError(401, "Something Wrong")
        },
        async print_rs(rsid, type) {
            let data = { 
                params: {
                    rs_id: rsid,
                    type: type,
                    user_id: this.$session.get('user_id'),
                    user_fullname: this.$session.get('user_fullname')
                },
                headers: tokenApi('token', 'header')
            }
            let result = await axios.get(apiUrl+'purchaser/inquiry_rs/print_rs', data)
            .then(async (response) => {
                msgSuccess(200, "Successfully printed!", "Success")
                await this.fetch_list_request()
                await this.fetch_list_supplier()
            })
            .catch(async (response) => {
                msgError(401, response)
            })
        },
        async boDetails(type, rs_id) {
            const view = (type == 1) ? 'view_rs' : 'movement_rs'
            let brCode = (this.branchCode == undefined) ? '' : this.branchCode
            this.$router.push({ name: 'BoDetails', params: { rs_id: rs_id, type: view, brcode: brCode }})
        }
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

