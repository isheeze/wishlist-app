export const createMetaObjectDefinationWishlistQuery = () => (`#graphql
mutation {
    metaobjectDefinitionCreate(definition: {
        type: "$app:testlist",
        access: {
            admin: MERCHANT_READ,
            storefront: PUBLIC_READ
        },
        fieldDefinitions: [
            { key: "customer_id", name: "Customer", type: "single_line_text_field" },
            { key: "product_id", name: "Product", type: "single_line_text_field" }
        ]
    }) {
        metaobjectDefinition {
            id
            type
            fieldDefinitions {
                key
                name
                type {
                    name
                }
            }
        }
    }
}`)

export const addWishlistQuery = (customer_id, product_id) => (`#graphql
mutation {
  metaobjectCreate(metaobject: {
    type: "$app:wishlist",
    handle: "8-8${customer_id}8-8${product_id}8-8"
    fields: [
      {
        key: "customer_id",
        value: "${customer_id}"
      },
      {
        key: "product_id",
        value: "${product_id}"
      }
    ]
  }) {
    metaobject {
      id
      type
      customer_id: field(key: "customer_id") { value }
      product_id: field(key: "product_id") { value }
    }
  }
}`)

export const getUniqueWishlistItemQuery = (customer_id, product_id) => (`#graphql
query {
  metaobjects(type: "$app:wishlist", first: 10, query:"display_name:'8 8${customer_id}8 8${product_id}8 8'") {
    nodes {
      id
      customer_id: field(key: "customer_id") { value }
      product_id: field(key: "product_id") { value }
    }
  }
}`)

export const getWishlistItemsForClientQuery = (customer_id) => (`#graphql
query {
  metaobjects(type: "$app:wishlist", first: 10, query:"display_name:'8 8${customer_id}8 '") {
    nodes {
      id
      customer_id: field(key: "customer_id") { value }
      product_id: field(key: "product_id") { value }
    }
  }
}`)

export const deleteWishlistItemQuery = () => (`#graphql
mutation metaobjectDelete($id: ID!) {
  metaobjectDelete(id: $id) {
    deletedId
    userErrors {
      field
      message
    }
  }
}`)