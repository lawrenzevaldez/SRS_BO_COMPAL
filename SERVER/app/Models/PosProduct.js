'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Db = use('Database')
const Env = use('Env')
const br_code = Env.get('BRANCH_CODE', '')
const CustomException = use('App/Exceptions/CustomException')
const _ = require('lodash')

class PosProduct extends Model {

    /**
     * reusable function pos_products table
     * @param {object, json} where
     * @param {string} select 
     */
    async fetch_pos_product(where, select="*") {

        let column = []
        let value  = []

        _.each(where, function(values, fields) {
            column.push(fields + " = ?") //sample output column ['barcode = ?', 'product_id = ? ']
            value.push(values.toString())  //sample output value where ['2303230230', '12312312']
        })
        
        let field = column.toString()
        let row = await Db.connection('srspos')
                          .raw(`SELECT ${select} FROM pos_products WHERE ${field}`, value)
        return (row.length > 1) ? -1 : row
    }

    // CHCECKING OF SELLINGAREA IF NEGATIVE
    async fetch_product_selling_area(productid) {
        let row = await Db.connection('srspos')
                          .select('*')
                          .from('products')
                          .where('productid', productid)
        return (row.length > 1 ) ? -1 : row
    }
    // ./CHCECKING OF SELLINGAREA IF NEGATIVE

    async auth(username, password) {
        let row = await Db.connection('srspos')
                          .select('loginid', 'name', 'password')
                          .from('markusers')
                          .where('loginid', username)
                          .andWhere('password', password)
        await Db.close()
        return (row.length == 0) ? '' : row[0]
    }

}

module.exports = new PosProduct
