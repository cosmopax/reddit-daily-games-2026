# payments_add

Source: https://developers.reddit.com/docs/earn-money/payments/payments_add

On this page

The Devvit payments API is available in Devvit Web. Keep reading to learn how to configure your products and accept payments.

note

Devvit Web is recommended for payments. Check out how to [migrate blocks apps](/docs/earn-money/payments/payments_migrate) if you're app is currently using a blocks version of payments.

To start with a template, select the payments template when you create a new project or run:
    
    
    devvit new  
    

To add payments functionality to an existing app, run:
    
    
    npm install @devvit/payments  
    

note

Make sure you’re on Devvit 0.11.3 or higher. See the [quickstart](https://developers.reddit.com/docs/next/quickstart) to get up and running.

## Implement Devvit Web payments​

### Configure devvit.json​

You can reference an external `products.json` file, or define products directly. Endpoints are required for fulfillment and optional for refunds.

devvit.json
    
    
    {  
      "payments": {  
        "productsFile": "./products.json",  
        // optionally define products here: "products": [...] instead  
        "endpoints": {  
          "fulfillOrder": "/internal/payments/fulfill",  
          "refundOrder": "/internal/payments/refund"  
        }  
      }  
    }  
    

### Server: fulfill (and optional refund)​

Create endpoints to fulfill and optionally revoke purchases.

server/index.ts
    
    
    import type { PaymentHandlerResponse } from '@devvit/web/server';  
      
    router.post('/internal/payments/fulfill', async (req, res) => {  
      // Fulfill the order (grant entitlements, record delivery, etc.)  
      res.json({ success: true } satisfies PaymentHandlerResponse);  
    });  
      
    router.post('/internal/payments/refund', async (req, res) => {  
      // Optionally revoke entitlements for a refunded order  
      res.json({ success: true } satisfies PaymentHandlerResponse);  
    });  
      
    export default router;  
    

### Server: Fetch products​

On the server, use `payments.getProducts()` and `payments.getOrders()`. If the client needs product metadata, expose it via your own `/api/` endpoint.

server/index.ts
    
    
    // Example: expose products for client display  
    import { payments } from '@devvit/web/server';  
      
    const products = await payments.getProducts();  
    res.json(products);  
    

### Client: trigger checkout​

Use `purchase()` from `@devvit/web/client` with a product SKU (or array of SKUs).

client/index.ts
    
    
    import { purchase, OrderResultStatus } from '@devvit/web/client';  
      
    export async function buy(sku: string) {  
      const result = await purchase(sku);  
      if (result.status === OrderResultStatus.STATUS_SUCCESS) {  
        // show success  
      } else {  
        // show error or retry (result.errorMessage may be set)  
      }  
    }  
    

## Register products​

Register products in the src/products.json file in your local app. To add products to your app, run the following command:
    
    
    devvit products add  
    

Registered products are updated every time an app is uploaded, including when you use [Devvit playtest](/docs/guides/tools/playtest).

Click here for instructions on how to add products manually to your products.json file.

The JSON schema for the file format is available at <https://developers.reddit.com/schema/products.json>. 

Each product in the products field has the following attributes:

**Attribute**| **Description**| `sku`| A product identifier that can be used to group orders or organize your products. Each sku must be unique for each product in your app.| `displayName`| The official name of the product that is displayed in purchase confirmation screens. The name must be fewer than 50 characters, including spaces.| `description`| A text string that describes the product and is displayed in purchase confirmation screens. The description must be fewer than 150 characters, including spaces.| `price`| An predefined integer that sets the product price in Reddit gold. See details below.| `image.icon`| **(optional)** The path to the icon that represents your product in your assets folder.| `metadata`| **(optional)** An optional object that contains additional attributes you want to use to group and filter products. Keys and values must be alphanumeric (a - Z, 0 - 9, and - ) and contain 30 characters or less. You can add up to 10 metadata keys. Metadata keys cannot start with "devvit-".| `accountingType`| Categories for how buyers consume your products. Possible values are: 

  * `INSTANT` for purchased items that are used immediately and disappear.
  * `DURABLE` for purchased items that are permanently applied to the account and can be used any number of times
  * `CONSUMABLE` for items that can be used at a later date but are removed once they are used.
  * `VALID_FOR_` values indicate a product can be used throughout a period of time after it is purchased.

  
---|---  
  
## Price products​

Product prices are predefined and must be one of the following gold values:

  * 5 gold ($0.10)
  * 25 gold ($0.50)
  * 50 gold ($1)
  * 100 gold ($2)
  * 150 gold ($3)
  * 250 gold ($5)
  * 500 gold ($10)
  * 1000 gold ($20)
  * 2500 gold ($50)

note

Actual payments will not be processed until your products are approved. While your app is under development, you can use sandbox payments to [simulate purchases](/docs/earn-money/payments/payments_test#simulate-purchases).

## Design guidelines​

You’ll need to clearly identify paid products or services. Here are some best practices to follow:

  * Use a short name, description, and image for each product.
  * Don’t overwhelm users with too many items.
  * Try to keep purchases in a consistent location or use a consistent visual pattern.
  * Only use the gold icon to indicate purchases for Reddit gold.

### Product image​

Product images need to meet the following requirements:

  * Minimum size: 256x256
  * Supported file type: .png

If you don’t provide an image, the default Reddit product image is used.

![default image](/docs/assets/images/default_product_image-550c52f2d1c20755f657435ba9db5362.png)

**Example**
    
    
    {  
      "$schema": "https://developers.reddit.com/schema/products.json",  
      "products": [  
        {  
          "sku": "god_mode",  
          "displayName": "God mode",  
          "description": "God mode gives you superpowers (in theory)",  
          "price": 25,  
          "images": {  
            "icon": "products/extra_life_icon.png"  
          },  
          "metadata": {  
            "category": "powerup"  
          },  
          "accountingType": "CONSUMABLE"  
        }  
      ]  
    }  
    

### Purchase buttons (required)​

#### Blocks​

The `ProductButton` is a Devvit blocks component designed to render a product with a purchase button. It can be customized to match your app's look and feel.

**Usage:**
    
    
    <ProductButton  
      showIcon  
      product={product}  
      onPress={(p) => payments.purchase(p.sku)}  
      appearance="tile"  
    />  
    

##### `ProductButtonProps`​

**Prop Name**| **Type**| **Description**| `product`| `Product`| The product object containing details such as `sku`, `price`, and `metadata`.| `onPress`| `(product: Product) => void`| Callback function triggered when the button is pressed.| `showIcon`| `boolean`| Determines whether the product icon is displayed on the button. Defaults to `false`.| `appearance`| `'compact'` | `'detailed'` | `'tile'`| Defines the visual style of the button. Defaults to `compact`.| `buttonAppearance`| `string`| Optional [button appearance](/docs/blocks/button#appearance).| `textColor`| `string`| Optional [text color](/docs/blocks/text#color).  
---|---|---  
  
#### Webviews​

Use Reddit’s primary, secondary, or bordered button component and gold icon in one of the following formats:

![default image](data:image/png;base64,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)

Use a consistent and clear product component to display paid goods or services to your users. Product components can be customized to fit your app, like the examples below.

![default image](/docs/assets/images/payments_component_button-d663655b01d9c6346a5d8a13a8b9ca24.png)

![default image](/docs/assets/images/payments_component_list-d0c9426edcee85b69989aee16f368f87.png)

![default image](/docs/assets/images/payments_component_tile-f945f5cfa58496a33439b250f846e7fd.png)

## Complete the payment flow​

Use `addPaymentHandler` to specify the function that is called during the order flow. This customizes how your app fulfills product orders and provides the ability for you to reject an order.

Errors thrown within the payment handler automatically reject the order. To provide a custom error message to the frontend of your application, you can return {success: false, reason: } with a reason for the order rejection.

This example shows how to issue an "extra life" to a user when they purchase the "extra_life" product.
    
    
    import { type Context } from '@devvit/public-api';  
    import { addPaymentHandler } from '@devvit/payments';  
    import { Devvit, useState } from '@devvit/public-api';  
      
    Devvit.configure({  
      redis: true,  
      redditAPI: true,  
    });  
      
    const GOD_MODE_SKU = 'god_mode';  
      
    addPaymentHandler({  
      fulfillOrder: async (order, ctx) => {  
        if (!order.products.some(({ sku }) => sku === GOD_MODE_SKU)) {  
          throw new Error('Unable to fulfill order: sku not found');  
        }  
        if (order.status !== 'PAID') {  
          throw new Error('Becoming a god has a cost (in Reddit Gold)');  
        }  
      
        const redisKey = godModeRedisKey(ctx.postId, ctx.userId);  
        await ctx.redis.set(redisKey, 'true');  
      },  
    });  
    

## Implement payments​

The frontend and backend of your app coordinate order processing.

![Order workflow diagram](/docs/assets/images/payments_order_flow_diagram-87cf8d2e76dde9612ee794f9a95f4bcf.png)

To launch the payment flow, create a hook with `usePayments()` followed by `hook.purchase()` to initiate the purchase from the frontend.

This triggers a native payment flow on all platforms (web, iOS, Android) that works with the Reddit backend to process the order. The `fulfillOrder()` hook calls your app during this process.

Your app can acknowledge or reject the order. For example, for goods with limited quantities, your app may reject an order once the product is sold out.

### Get your product details​

Use the `useProducts` hook or `getProducts` function to fetch details about products.
    
    
    import { useProducts } from '@devvit/payments';  
      
    export function ProductsList(context: Devvit.Context): JSX.Element {  
      // Only query for products with the metadata "category" of value "powerup".  
      // The metadata field can be empty - if it is, useProducts will not filter on metadata.  
      const { products } = useProducts(context, {  
        metadata: {  
          category: 'powerup',  
        },  
      });  
      
      return (  
        <vstack>  
          {products.map((product) => (  
            <hstack>  
              <text>{product.name}</text>  
              <text>{product.price}</text>  
            </hstack>  
          ))}  
        </vstack>  
      );  
    }  
    

You can also fetch all products using custom-defined metadata or by an array of skus. Only one is required; if you provide both then they will be AND’d.
    
    
    import { getProducts } from '@devvit/payments';  
    const products = await getProducts({,  
    });  
    

### Initiate orders​

Provide the product sku to trigger a purchase. This automatically populates the most recently-approved product metadata for that product id.

**Example**
    
    
    import { usePayments } from '@devvit/payments';  
      
    // handles purchase results  
    const payments = usePayments((result: OnPurchaseResult) => { console.log('Tried to buy:', result.sku, '; result:', result.status); });  
      
    // for each sku in products:  
    <button onPress{payments.purchase(sku)}>Buy a {sku}</button>  
    

  * Implement Devvit Web payments
    * Configure devvit.json
    * Server: fulfill (and optional refund)
    * Server: Fetch products
    * Client: trigger checkout
  * Register products
  * Price products
  * Design guidelines
    * Product image
    * Purchase buttons (required)
  * Complete the payment flow
  * Implement payments
    * Get your product details
    * Initiate orders