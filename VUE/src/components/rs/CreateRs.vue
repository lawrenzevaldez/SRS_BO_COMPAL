<template>
    
   <div class="panel-body">
        <!-- Main content -->
    <div class="content-wrapper  col-sm-12">
		<button class="btn btn-primary pull-right btn-sm" style="margin-bottom:5px;" v-on:click="postCreateRs()"><i class="icon-plus3"></i> POST RS</button>
        <div class="clearfix"></div>
        <div v-if="loading_postrs_no" class="alert alert-success">
            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
            <strong>Posted!</strong> RS #{{ postrs_no }} Paki save po sa papel.
        </div>
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
                        <tr v-for="(row, i) in list_rms_items" :key="i">
                            <td>
                                    <b>SUPPLIER NAME: {{ row.supplier_name }} <button class="btn btn-primary" v-on:click="show(row.count_vendor, row.rs_id, row.supplier_code)" v-if="row.count_vendor.length != '1'">CHANGE</button><br>
                                    ITEM: {{ row.item_name }}<br>
                                    QTY: {{ row.qty }}<br>
                                UOM: {{ row.uom }} <br>
                                PRICE: {{ row.price }} <br>
                                AMOUNT: {{ row.qty * row.price }} <br>
                                TYPE: {{ (row.rs_action == 1) ? 'RETURN' : 'DISPOSE' }} <br>
                                RS #: {{ row.rs_id }} <br></b>
                            </td>
                            <td hidden><input type="hidden" v-bind:name="'supplier_code'+ i" v-bind:value="row.supplier_code"></td>
                            <td>
                                <button class="btn btn-danger btn-xs" v-on:click="deleteItem(row.id, row.supplier_code, row.rs_id)"><i class="icon-trash"></i></button> 
                                <p v-show="loading_deletingrs" class="pull-center" >
                                    <i class="icon-spinner4 spinner position-left"></i> PLEASE WAIT ..
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td >
                                <p v-show="loading_barcode" class="pull-center" >
                                    <i class="icon-spinner4 spinner position-left"></i> PLEASE WAIT ..
                                </p>
                                <input type="text" class="form-control" placeholder="Barcode" v-model="p_barcode" v-on:keyup.13="fetch_barcode" > <br>
                                <input type="text" class="form-control" v-model="p_qty"><br>
                                <p v-show="loading_uom" class="pull-center" >
                                    <i class="icon-spinner4 spinner position-left"></i> PLEASE WAIT ..
                                </p>
                                <select v-show="!loading_uom" class="form-control" v-model="p_uom" style="text-align:center !important;">
                                    <option value="">  -- SELECT UOM --  </option>
                                    <option v-bind:value="row.uom+'~'+row.qty" v-for="(row, i) in list_uom" :key="i"> {{ row.uom }} - {{row.qty}} </option>
                                </select>
                            </td>
                            <td>
                                
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
        <!-- CHANGE SUPPLIER -->
        <modal name="changeSupplierModal" @before-open="beforeOpen" :height="150">
            <div class="row center-block">
                <div class="col-md-12" style="padding-top:8px;">
                    <form>
                        <div class="form-group">
                            <label for="sel1" class="col-md-2">Supplier :</label>
                            <select v-model="supplierCodeChange" class="form-control col-md-8" id="sel1" v-on:change="updateSupplier(supplierCodeChange, ChangeRs_id)">
                                <option disabled selected>-- Change Supplier --</option>
                                <option v-for="(rows, i) in list_of_suppliers" :key="i" :value="rows.VendorCode">{{ rows.supplierName }}</option>
                            </select>
                        </div>
                        <div class="row">
                            <div class="col-md-12 text-right" style="margin-top: 15px;">
                                <button type="button" class="btn btn-default" @click="hide()" style="margin-right: 5px;">Cancel</button>
                                <button type="button" class="btn btn-success">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </modal>
        <!-- ./ CHANGE SUPPLIER -->
    </div>


</template>
<script>
import axios from 'axios';
import { msgError, msgSuccess, tokenApi, apiUrl } from './../../assets/custom/custom.js'
import { async } from 'q';

export default {
    data (){
        return {
           p_barcode: '',
           p_uom: '',
           p_qty: 1,
           temp_qty : 0,
           list_uom: [],
           list_rms_items: [],
           loading_uom: false,
           loading_barcode: false,
           loading_deletingrs: false,
           postrs_no: '',
           loading_postrs_no: false,
           //UPDATE SUPPLIER
           list_of_suppliers: [],
           ChangeSupplierCode: '',
           ChangeRs_id: '',
           supplierCodeChange: '',
        }
    },
    computed: {
         message(){
             return this.$store.getters.message
         }
    },
    async mounted(){
        await this.fetch_list_uom()
        await this.fetch_rms_items()
    },
    methods: {
        async fetch_barcode() {
            this.loading_barcode = true //activate loading
            try {
                 let params = {
                        p_barcode: this.p_barcode,
                        p_uom: this.p_uom,
                        p_qty: this.p_qty
                }
                
                let result = await axios.post(apiUrl+'purchaser/rs/fetch_barcode', params, tokenApi())
                this.fetch_rms_items()
				this.p_barcode = ''
            } catch (error) {
                await this.handdleError(error)
            }
            this.loading_barcode = false //deactivate loading
        },
        async fetch_list_uom() {
            this.loading_uom = true //activate loading
            try {
                let query = {
                     headers: tokenApi('token', 'header')
                }
                let result = await axios.get(apiUrl+'purchaser/rs/fetch_list_uom', query)
                let data   = result.data
                this.list_uom = data.uom

            } catch (error) {
                await this.handdleError(error)
            }
            this.loading_uom = false //deactivate loading
        },
        async fetch_rms_items(){
             this.loading_uom = true //activate loading
            try {
                let query = {
                     headers: tokenApi('token', 'header')
                }
                let result = await axios.get(apiUrl+'purchaser/rs/fetch_rms_items', query)
                let data   = result.data
                this.list_rms_items = data.items

            } catch (error) {
                await this.handdleError(error)
            }
            this.loading_uom = false //deactivate loading
           
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
        async deleteItem(id, supplier_code, rs_id){
            this.loading_deletingrs = true
            try {
                let params = {
                    id: id,
                    supplier_code: supplier_code,
                    rs_id: rs_id
                }
                
                let result = await axios.post(apiUrl+'purchaser/rs/delete_rs', params, tokenApi())
                this.fetch_rms_items()

            } catch (error) {
                await this.handdleError(error)
            }
            this.loading_deletingrs = false
        },
        async postCreateRs(){
            let vendor_list = []
			let values = $("input[name^='supplier_code']") .map(function( row, ele ) {
				vendor_list.push($(ele).val())
			})
            .get()
            
            swal({
				title: 'Are you sure?',
				text: "You want to post this transaction ?",
				type: 'info',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes'
            },
			async (isConfirm) => {
				if (isConfirm) {
                    let result = await axios.post(apiUrl+'purchaser/rs/create_rs', {vendor_list: vendor_list, user_id: this.$session.get('user_id'), user_fullname: this.$session.get('user_fullname')},  tokenApi())
                    .then((response) => {
                        this.postrs_no = response.data.movementId
                        this.loading_postrs_no = true
                    })
                    this.fetch_rms_items()
				}
			})
        },
        async show(listSuppliers, rs_id, supplier_code) {
            this.$modal.show('changeSupplierModal', { listSupplier: listSuppliers, ChangeRs_id: rs_id, supplierCode: supplier_code })
        },
        async hide() {
            this.$modal.hide('changeSupplierModal')
        },
        async beforeOpen (event) {
            this.list_of_suppliers = []
            this.ChangeSupplierCode = ''
            this.ChangeRs_id = ''
            this.list_of_suppliers = event.params.listSupplier
            this.ChangeSupplierCode = event.params.supplierCode
            this.ChangeRs_id = event.params.ChangeRs_id
        },
        async updateSupplier(supplierCode, rsId) {
            try {
                let params = {
                    supplierCode: supplierCode,
                    rs_id: rsId,
                    user_id: this.$session.get('user_id')
        }

                let result = await axios.post(apiUrl+'purchaser/rs/updateSupplier', params, tokenApi())
                .then(async (response) => {
                    msgSuccess(200, response.data.message, "Success")
                    this.$modal.hide('changeSupplierModal')
                    this.fetch_rms_items()
                })
                .catch(async (response) => {
                    msgError(401, response)
                })
                
            } catch (error) {
                await this.handdleError(error)
            }
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

