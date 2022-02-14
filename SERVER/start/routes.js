'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})


Route.group(() => {
  Route.post('/purchaser/receive_po/auth', 'AuthController.auth')
  Route.get('/purchaser/receive_po/logout', 'AuthController.logout')
  
  Route.get('/purchaser/rs/fetch_list_uom', 'RsController.fetch_list_uom')
  Route.get('/purchaser/rs/fetch_rms_items', 'RsController.fetch_rms_items')
  Route.post('/purchaser/rs/fetch_barcode', 'RsController.fetch_barcode')
       .middleware(['checkUser'])
  Route.post('/purchaser/rs/delete_rs', 'RsController.delete_rs')
  Route.post('/purchaser/rs/create_rs', 'RsController.post_rs')
       .middleware(['checkUser'])
  Route.post('/purchaser/rs/updateSupplier', 'RsController.updateSupplier')
       .middleware(['checkUser'])

  Route.get('/purchaser/inquiry_rs/fetch_list_supplier', 'InquiryRsController.fetch_list_supplier')
  Route.get('/purchaser/inquiry_rs/getListRequest', 'InquiryRsController.getListRequest')
  Route.post('/purchaser/inquiry_rs/pickUpItem', 'InquiryRsController.pickUpItem')
  Route.get('/purchaser/inquiry_rs/viewItem', 'InquiryRsController.getItem')
  Route.get('/purchaser/inquiry_rs/print_rs', 'InquiryRsController.getPrintRs')
  Route.get('/purchaser/inquiry_rs/getDetails', 'InquiryRsController.getDetails')
  
  Route.get('/system/website/fetch_page_body', 'SystemController.fetch_page_body')
}).prefix('api')