<template>
    <!-- Second navbar -->
	<div class="navbar navbar-default" id="navbar-second">
		<ul class="nav navbar-nav no-border visible-xs-block">
			<li><a class="text-center collapsed" data-toggle="collapse" data-target="#navbar-second-toggle"><i class="icon-menu7"></i></a></li>
		</ul>

		<div class="navbar-collapse collapse" id="navbar-second-toggle">
			<ul class="nav navbar-nav">
				<li v-on:click="menuHide(true)"><router-link to="/"><i class="icon-display4 position-left"></i> Dashboard </router-link></li>

				<li class="dropdown mega-menu mega-menu-wide" >
					<a href="#" class="dropdown-toggle"  v-on:click="menuHide(true)" data-toggle="dropdown" ><i class="icon-list position-left"></i> Mega menu <span class="caret"></span></a>

					<div class="dropdown-menu dropdown-content" v-show="menu_list">
						<div class="dropdown-content-body">
							<div class="row">
								<div class="col-md-3">
									<span class="menu-heading underlined">SRS RS</span>
									<ul class="menu-list" v-on:click="menuHide()">
										<li><router-link to="/bo/create_rs">Create RS</router-link></li>
									</ul>
								</div>
								<div class="col-md-3">
									<span class="menu-heading underlined">SRS RS INQUIRY</span>
									<ul class="menu-list" v-on:click="menuHide()">
										<li><router-link to="/bo/rs_inquiry">RS Inquiry</router-link></li>
										<li><router-link to="/bo/bo_inquiry">BO Inquiry</router-link></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</li>
				
			</ul>

		</div>
	</div>
	<!-- /second navbar -->
</template>

<script>
export default {
	data(){
		return {
			menu_list: true
		}
	},
	methods:{
		async menuHide(type=false){
			this.menu_list = type
		}
	}
}
</script>

