import {json} from '@remix-run/node'
import db from '../db.server'
import { cors } from 'remix-utils/cors'
import { authenticate } from "../shopify.server";

import { appInstallationIdQuery, createMetaObjectWishlistQuery } from "../../metaDB/definationsGraphQuries";

export const action = async ({request}) => {

    const { admin } = await authenticate.public.appProxy(request);

    /**** create app owned metafields ***/
    const responseAppInstallationId = await admin.graphql(
        appInstallationIdQuery
    );
    const appInsId = (await responseAppInstallationId.json()).data.currentAppInstallation.id

    /**** create app owned metaobjects ***/
    const responseCreateMetaObjectWishlist = await admin.graphql(
        createMetaObjectWishlistQuery
    )
    console.log(responseCreateMetaObjectWishlist)
      

    return json({ responseCreateMetaObjectWishlist });

    let body = await request.formData()

    let shop_id = body.get("shop_id") || null
    let customer_id = body.get("customer_id") || null
    let product_id = body.get("product_id") || null
    let action = body.get("action") || null


    if(shop_id == null || customer_id == null || product_id == null || action == null){
        return json({message: "Required rguments are missing..."})
    }else{
        switch(action){
            case 'add':
                let data = await db.Wishlist.findMany({ where: {shop_id,customer_id,product_id} })
                if(data.length){
                    return json({message:"already created...."})
                }else{
                    let data = await db.Wishlist.create({data:{shop_id,customer_id,product_id}})
                    const response = json({message: "Added to wishlist...",data})
                    return await cors(request,response)
                }
                
        }
        return json({body:{shop_id,customer_id,product_id,action}})
    }
}