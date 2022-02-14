'use strict'
const RsMod    = use('App/Models/Rs')
const PosProductMod    = use('App/Models/PosProduct')
const CustomException = use('App/Exceptions/CustomException')
const Env = use('Env')
const leftPad = use('left-pad')
const _ = use('lodash')
const Redis = use('Redis')
const moment = require('moment')
const TO_DATE = Env.get('TO_DATE')

class RsController {

    constructor() {
        this.branchCode = Env.get('BRANCH_CODE', '')
		this.branchName = Env.get('BRANCH_NAME', '')
    }

    async fetch_barcode({ request, response }) {
        //user
        let user_id  = await Redis.get(request.user_id)
        // let user_id = 2019
        let { p_barcode, p_uom, p_qty } = request.only(['p_barcode', 'p_uom', 'p_qty'])
        
        if (p_barcode == null) {
            throw new CustomException({ message: "Barcode is required" }, 401)
        }

        if (p_qty == null || p_qty < 0) {
            throw new CustomException({ message: "Quantity is required OR Quantity must be greater than 1" }, 401)
        }

        let where_pos   = { barcode: p_barcode }
        let field_pos   = ['description, uom, productid, qty, pricemodecode, barcode, srp']
        let pos_product = await PosProductMod.fetch_pos_product(where_pos, field_pos)

        if (pos_product == -1) {
            throw new CustomException({ message: `Opss BARCODE (${p_barcode}) is assigned to 2 or more Product ID` }, 401)
        }

        if (pos_product.length == 0) {
            throw new CustomException({ message: `Opss Barcode(${p_barcode}) does not exist` }, 401)
        }

        let productid   = pos_product[0].productid
        let description = pos_product[0].description
        let uom         = pos_product[0].uom
        let qtys        = pos_product[0].qty
        
        let vendor      = await RsMod.fetch_vendor(productid)
        let vendor_code = vendor.vendorcode
        let total_cost  = vendor.averagenetcost

        if (total_cost <= 0) {
            throw new CustomException({ message: `${p_barcode} OR ${description} unit cost is equal or less than to zero. Kindly inform Audit or ISD Department to proceed scanning of this item` }, 401)
        }

        let multip_ = qtys
        let c_multip= 0
        let o_uom   = uom

        if (p_uom != null) {
            let arr_uom = p_uom.split('~') //array[0] uom array[1] for quantity
            c_multip = parseFloat(arr_uom[1])
            multip_  = c_multip
            uom      = arr_uom[0]
        }

        let cost_fixed = parseFloat(total_cost) * Math.abs(multip_)
        let cost       = cost_fixed.toFixed(4)

        let rs_id      = await RsMod.fetch_rs_id(vendor_code, 0) //fetch rs id pending
        let rs_qty     = await RsMod.fetch_rs_qty_items(p_barcode, uom,  rs_id)

        let pcsQty     = parseFloat(qtys) * parseFloat(p_qty)
        let product_sellingArea = await PosProductMod.fetch_product_selling_area(productid)

        if(pcsQty <= product_sellingArea[0].SellingArea) {
            if(!product_sellingArea[0]) {
                await RsMod.saveAuditTrail(user_id, product_sellingArea[1])
                throw new CustomException({ message: product_sellingArea[1] }, 401)
            }
        } else{
            let description = `${p_barcode} OR ${pos_product[0].description} is currently negative.`
            await RsMod.saveAuditTrail(user_id, description)
            throw new CustomException({ message: description }, 401)
        }

        if (rs_id == 0 || rs_qty == 0) {

            await RsMod.add_rms_header_and_items(productid, p_barcode, description, uom, p_qty, cost, vendor_code, o_uom, c_multip, qtys, user_id, rs_id)
        } else {
           
            await RsMod.update_rms_items(rs_id, parseFloat(p_qty), cost, p_barcode, uom)
        }

        response.status(200).send({  })
    }

    async fetch_list_uom({ request, response }) {

        let uom = await RsMod.fetch_list_uom()

        response.status(200).send({ uom })
    }

    async fetch_rms_items({ request, response }) {

        let rms_items = await RsMod.fetch_rms_items()
        let items = [], message = ''

        if(!rms_items)
        {
            response.status(200).send("Error in RMS ITEMS")
        }

        let supplier_name_row = await RsMod.getAllSupplier()

        for(const row of rms_items) {
            let supplier = _.find(supplier_name_row, { vendorcode: row.supplier_code })
            if(supplier == undefined) 
                supplier = "NO NAME"
            else 
                supplier = supplier.description

            let price = row.qty * row.price
            items.push({
                supplier_name: supplier ,
				item_name: row.item_name,
				qty: row.qty,
				uom: row.uom,
				amount: price.toFixed(3),
				price: row.price,
				rs_action: row.rs_action,
				rs_id: row.rs_id,
				id:row.id,
                supplier_code: row.supplier_code,
                count_vendor: await RsMod.getCountVendor(row.prod_id)
            })
        }

        response.status(200).send({ items })
    }

    async updateSupplier({ request, response }) {

        let { supplierCode, rs_id, user_id } = request.only(['supplierCode', 'rs_id', 'user_id'])

        let result = await RsMod.updateSupplier(supplierCode, rs_id)
        let message

        if(!result)
        {
            let description = "Something wrong, please try again or refresh the browser."
            message = description
            response.status(200).send(description)
            await RsMod.saveAuditTrail(user_id, description)
            throw new CustomException({ message: description }, 401)
        }

        message = "Successfully changed supplier."

        response.status(200).send({ message })
    }

    async delete_rs({ request, response})
    {
        
        let { id, supplier_code, rs_id } = request.only(['id', 'supplier_code', 'rs_id'])
        
        let deleteItem = await RsMod.delete_rs(id, supplier_code, rs_id)
        if(!deleteItem){
            throw new CustomException({ message: `Something wrong on deleting this item.` }, 401)
        }
        response.status(200).send({  })
    }

    async post_rs({ request, response })
    {
        try
        {
            let { vendor_list, user_id, user_fullname } = request.only(['vendor_list', 'user_id', 'user_fullname'])
            let itemsHeader = []
            let movementId

            let vendor_array = _.uniqBy(vendor_list)
            let invalid_barcode_counter = 0

            let rowRms = await RsMod.getRmsHeader(vendor_array)
            if(!rowRms)
            {
                throw new CustomException({ message: `Something wrong in fetching header rms please refresh and try again.` }, 401)
            }
            let rs_list = []

            if(invalid_barcode_counter == 0)
            {
                for(const row of rowRms)
                {
                    // console.log(row.rs_id)
                    if(row.rs_action !== 0 && row.supplier_peding !== 1)
                    {
                        let rs_id = row.rs_id
                        let rs_action = row.rs_action
                        let comment = ""

                        if(rs_action == 1)
						{
                            itemsHeader.push(row)
						}
                        let result = await RsMod.post_rs(rs_id, rs_action, comment, this.branchName, user_id)
                        if(!result.status) {
                            await RsMod.saveAuditTrail(user_id, result.message)
                            throw new CustomException({ message: result.message }, 401)
                        } else {
                            let movement_id = await RsMod.rsNoList(rs_id)
                            movementId = movement_id

                            await RsMod.saveAuditTrail(user_id, movementId)
                            await RsMod.print_rs(user_fullname, rs_id, 0, true)
                        }
                    }
                }

                response.status(200).send({ movementId: movementId })
                
            } else {
                throw new CustomException({ message: response }, 401)
            }
        } catch(Exception) {
            console.log(Exception)
        }
    }

    async login ({ auth, request }) {
        console.log(request.all())
    }
}

module.exports = RsController