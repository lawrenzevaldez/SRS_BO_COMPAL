<template>
    <!-- Page container -->
	<div class="page-container">
		<!-- Page content -->
		<div class="page-content">
			<!-- Main content -->
			<div class="content-wrapper">
				<!-- Simple panel -->
				<div class="panel panel-flat">
                  <div class="panel-heading">
                    <!-- <h5 class="panel-title">Simple panel</h5> -->
                  </div>

                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// export default {
// 	data() {
// 		return  {
// 			menu_list: true,
// 		}
// 	  },
// 	  methods: {
// 		  async menuHide(type=false) {
// 				this.menu_list = type
// 		  }
// 	  }
// }
</script>

