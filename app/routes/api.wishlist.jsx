import { json } from '@remix-run/node'
import { authenticate } from '../shopify.server'
import db from "../db.server"
import {
    createMetaObjectDefinationWishlistQuery,
    addWishlistQuery,
    getUniqueWishlistItemQuery,
    getWishlistItemsForClientQuery,
    deleteWishlistItemQuery
} from "../metaObjectQueries";

export const action = async({request}) => {
    const { admin } = await authenticate.public.appProxy(request)

    let body = await request.formData()

    let shop_id = body.get("shop_id") || null
    let customer_id = body.get("customer_id") || null
    let product_id = body.get("product_id") || null
    let action = body.get("action") || null
    
    switch(action){
        /**** create app owned metaobject's defination ****/
        case 'createMetaDefination':
            const responseMetaObjectDefinationWishlist = await admin.graphql(
                createMetaObjectDefinationWishlistQuery()
            )
            const dataMetaObjectDefinationWishlist = await responseMetaObjectDefinationWishlist.json()
            return json({ data: dataMetaObjectDefinationWishlist })

        /**** add entry into wishlist database and metaobject ****/
        case 'add':
            {
                console.log("0")
                if(shop_id == null || customer_id == null || product_id == null){ return json({message: "Required rguments are missing..."}) }
            
                /**** Entry in db ****/
                console.log("1")
                let data = await db.Wishlist.findMany({ where: {shop_id,customer_id,product_id} })
                console.log("2")
                if(data.length){
                    console.log("3")
                    return json({message:"already created...."})
                }else{
                    console.log("4")
                    let data = await db.Wishlist.create({data:{shop_id,customer_id,product_id}})
                }

                /**** Entry in metaobjects ****/
                console.log("5")
                const responseAddWishlist = await admin.graphql(
                    addWishlistQuery(customer_id,product_id)
                )
                console.log("6")
                const dataAddWishlist = await responseAddWishlist.json()
                console.log("7")

                return json({"message": "Added to wishlist...","prisma":data,"metaObj":dataAddWishlist})
            }
        /**** delete entry into wishlist database and metaobject ****/
        case 'delete':
            {
                if(shop_id == null || customer_id == null || product_id == null){ return json({message: "Required rguments are missing..."}) }
            
                /**** delete from db ****/
                let data = await db.Wishlist.findMany({ where: {shop_id,customer_id,product_id} })
                if(data.length){
                    for(d of data){
                        await db.Wishlist.delete({
                            where:{
                                id:d.id
                            }
                        })
                    }
                    return json({message:"deleted...."})
                }

                /**** delete metaobjects ****/
                const responseGetUniqueWishlistItemQuery = await admin.graphql(
                    getUniqueWishlistItemQuery()
                )
                const dataGetUniqueWishlistItemQuery = await responseGetUniqueWishlistItemQuery.json()
                if(dataGetUniqueWishlistItemQuery.length){
                    const responseDeleteWishlistItem = await admin.graphql(
                        deleteWishlistItemQuery(customer_id,product_id),
                        {
                            variables:{
                                id: dataGetUniqueWishlistItemQuery[0].id
                            } 
                        }
                    )
                    const dataDeleteWishlistItem = await responseDeleteWishlistItem.json()
                    return json({"message": "deleted ...",dataDeleteWishlistItem})
                }else{
                    return json({"message": "metaobject not found for deletion ..."})
                }
            }
        default:
            return json({"message":"unhandled endpoint..."})
    }
    return json({body:{shop_id,customer_id,product_id,action}})
}