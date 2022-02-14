<template>
    <!-- Main navbar -->
	<div class="navbar navbar-inverse">
		<div class="navbar-header">
			<a class="navbar-brand" href="/">SRS BO {{ branch_name }}</a>

			<ul class="nav navbar-nav pull-right visible-xs-block">
				<li><a data-toggle="collapse" data-target="#navbar-mobile"><i class="icon-tree5"></i></a></li>
			</ul>
		</div>

		<div class="navbar-collapse collapse" id="navbar-mobile">
			<ul class="nav navbar-nav navbar-right">
				<li class="dropdown dropdown-user">
					<a class="dropdown-toggle" data-toggle="dropdown">
						<img src="../../assets/global/images/image.png" alt="">
						<span>Welcome, {{ user_fullname }}</span>
						<i class="caret"></i>
					</a>

					<ul class="dropdown-menu dropdown-menu-right">
						<!-- <li><a href="#"><i class="icon-user-plus"></i> My profile</a></li>
						<li><a href="#"><i class="icon-coins"></i> My balance</a></li>
						<li><a href="#"><span class="badge badge-warning pull-right">58</span> <i class="icon-comment-discussion"></i> Messages</a></li>
						<li class="divider"></li>
						<li><a href="#"><i class="icon-cog5"></i> Account settings</a></li> -->
						<li><a href="#" v-on:click="logout()"><i class="icon-switch2"></i> Logout</a></li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
	<!-- /main navbar -->
</template>

<script>
import axios from 'axios'
import { f_apiUrl, removeToken, tokenApi } from './../../assets/custom/custom.js'
export default {
	data(){
		return  {
			menu_list: true,
			user_fullname: ''
		}
	},
	async mounted(){
		await this.user_details()
	},
	methods:{
		async fetch_page_body(){
			try{
				let result = await axios.get(apiUrl+'system/website/fetch_page_body')
				return result.data.BRANCH_NAME
			} catch (error){
				return 'NOVALICHES'
			}
		},
		async logout(){
			try {
				let query = {
					params: {
						user_id: this.$session.get('user_id')
					},
					headers: tokenApi('token', 'header')
				}
				await axios.get(f_apiUrl('purchaser/receive_po/logout'), query)
				this.$session.destroy()
				removeToken()
				window.location.href = '/'
			} catch (error) {
				console.log(error)
				alert('error')
			}
			
		},
		async user_details() {
			let session_id     = this.$session.id()
			this.$session.renew(session_id)
			this.user_fullname = this.$session.get('user_fullname')
			if(this.user_fullname == 'undefined' ) {
				this.$session.destroy()
				removeToken()
				window.location.href = '/'
			}
		} 
	},
	computed:{
		branch_name(){
			let branch_name = this.fetch_page_body()
			this.$store.commit('branch_name', branch_name)
			return  this.$store.getters.branch_name
		}
    }
}
</script>
