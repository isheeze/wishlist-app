export const appInstallationIdQuery = `#graphql
query {
    currentAppInstallation {
        id
    }
}`

export const createMetaObjectWishlistQuery = `mutation {
    metaobjectDefinitionCreate(definition: {
        type: "$app:wishlist",
        access: {
            admin: MERCHANT_READ,
            storefront: PUBLIC_READ
        },
        capabilities: {
            publishable: {
                enabled: true
            }
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
}`