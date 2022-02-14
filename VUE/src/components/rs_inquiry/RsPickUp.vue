<template>
    
   <div class="panel-body">
        <!-- Main content -->
        <div class="content-wrapper  col-sm-12">
            <div class="card">
                <div class="card-header header-elements-inline">
                    <h5 class="card-title">Form Details</h5>
                </div>
                <div class="card-body">
                    <div v-if="loading_status" class="alert alert-success">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>Success!</strong> {{ status }}.
                    </div>
                    <form action="#" method="post" v-on:submit.prevent="submitForm()">
                        <!-- <div v-if="pictureImage == ''" class="form-group">
                            <label><strong>Upload Image:</strong></label>
                            <div class="uniform-uploader">
                                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" class="form-input-styled form-control">
                            </div>
                        </div>
 
                        <div v-if="pictureImage != ''" class="form-group">
                            <label><strong>Upload Image:</strong></label>
                                <img class="img-responsive img-thumbnail" :src="pictureImage">
                        </div> -->

                        <div class="form-group">
                            <label><strong>Delivery Name:</strong></label>
                            <input type="text" :readonly="isReadonly" v-model="delivery_name" class="form-control" placeholder="Delivery Name">
                        </div>

                        <div class="form-group">
                            <label><strong>Plate Number:</strong></label>
                            <input type="text" :readonly="isReadonly" v-model="plate_number" class="form-control" placeholder="Plate Number">
                        </div>

                        <div class="text-right">
                            <button v-on:click="redirectPrevious()" :disabled="isDisabled" type="button" class="btn btn-default" style="margin-right: 5px;">Cancel</button>
                            <button type="submit" class="btn btn-primary" :disabled="isDisabled2">Save</button>
                        </div>
                    </form>
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
import { msgError, msgSuccess, tokenApi , apiUrl} from './../../assets/custom/custom.js'
import { async } from 'q'

export default {
    data (){
        return {
            rs_id: '',
            rs_action: '',
            delivery_name: '',
            plate_number: '',
            file: '',
            status: '',
            pictureImage: '',
            loading_status: false,
            isDisabled: false,
            isDisabled2: false,
            isReadonly: false
        }
    },
    created() {
        this.rs_id = this.$route.params.rs_id
        this.rs_action = this.$route.params.rs_action
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
                const response = JSON.parse(JSON.stringify(error))
                const status = response.response.status.toString()
                const message = (response.response.data.error === undefined) ? response.response.data.message : response.response.data.error.message
                msgError(status, message)
                return true
            }
                msgError(401, "Something Wrong")
        },
        async redirectPrevious() {
            this.$router.push({ name: 'RsInquiry' })
        },
        async handleFileUpload() {
            this.file = this.$refs.file.files[0];
        },
        async submitForm() {
            this.isDisabled = true
            this.isDisabled2 = true
            let formData = new FormData()
            // if (this.file == "") {
            //     return msgError(401, "Invoice file is required")
            // } else 
            if(this.delivery_name == "") {
                return msgError(401, "Delivery name is required")
            } else if(this.plate_number == "") {
                return msgError(401, "Plate number is required")
            }

            formData.append('rs_id', this.rs_id)
            formData.append('rs_action', this.rs_action)
            // formData.append('file', this.file)
            formData.append('deliveryName', this.delivery_name)
            formData.append('plateNumber', this.plate_number)
            formData.append('user_id', this.$session.get('user_id'))
            
            try
            {
                let result = await axios.post(apiUrl+'purchaser/inquiry_rs/pickUpItem', formData)
                this.loading_status = true                
                let data = result.data
                this.status = data.status
                this.isDisabled = false
                this.isDisabled2 = false
                this.$router.push({ name: 'RsInquiry' })
            }catch (Exception) {
                this.handdleError(Exception)
            }
        },
        async getFormDetails() {
            let query = { 
                params: {
                    rs_id: this.$route.params.rs_id
                },
                headers: tokenApi('token', 'header')
            }
            if(this.$route.params.rs_action != '') {
                let result = await axios.get(apiUrl+'purchaser/inquiry_rs/viewItem', query)               
                if(result) {
                    if(result.data.picture == '') {
                        let data = result.data
                        // this.pictureImage = data.picture
                        this.delivery_name = data.deliveryName
                        this.plate_number = data.plateNumber
                    }
                    else
                    {
                        let data = result.data
                        // this.pictureImage = data.picture
                        this.delivery_name = data.deliveryName
                        this.plate_number = data.plateNumber
                        this.isReadonly = true
                        this.isDisabled2 = true
                    }
                }
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

