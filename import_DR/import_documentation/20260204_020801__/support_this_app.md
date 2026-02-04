# support_this_app

Source: https://developers.reddit.com/docs/earn-money/payments/support_this_app

On this page

You can ask users to contribute to your app’s development by adding the “support this app” feature. This allows users to support your app with Reddit gold in exchange for some kind of award or recognition.

## Requirements​

  1. You must give something in return to users who support your app. This could be unique custom user flair, an honorable mention in a thank you post, or another creative way to show your appreciation.
  2. The “Support this App” purchase button must meet the Developer Platform’s [design guidelines](/docs/earn-money/payments/payments_add#design-guidelines).

## How to integrate app support​

### Create the product​

Use the Devvit CLI to generate the [product configuration](/docs/earn-money/payments/payments_add#register-products).
    
    
    devvit products add support-app  
    

### Add a payment handler​

The [payment handler](/docs/earn-money/payments/payments_add#complete-the-payment-flow) is where you award the promised incentive to your supporters. For example, this is how you can award custom user flair:
    
    
    addPaymentHandler({  
      fulfillOrder: async (order, context) => {  
        const username = await context.reddit.getCurrentUsername();  
        if (!username) {  
          throw new Error('User not found');  
        }  
      
        const subredditName = await context.reddit.getCurrentSubredditName();  
      
        await context.reddit.setUserFlair({  
          text: 'Super Duper User',  
          subredditName,  
          username,  
          backgroundColor: '#ffbea6',  
          textColor: 'dark',  
        });  
      },  
    });  
    

### Initiate purchases​

Next you need to provide a way for users to support your app:

  * If you use Devvit blocks, you can use the ProductButton helper to render a purchase button.
  * If you use webviews, make sure that your design follows the [design guidelines](/docs/earn-money/payments/payments_add#design-guidelines) to [initiate purchases](/docs/earn-money/payments/payments_add#initiate-orders).

![Support App Example](/docs/assets/images/support_this_app-9a4c545c397aeb378365f02af339be12.png)

Here's how you create a ProductButton in blocks:
    
    
    import { usePayments, useProducts } from '@devvit/payments';  
    import { ProductButton } from '@devvit/payments/helpers/ProductButton';  
    import { Devvit } from '@devvit/public-api';  
      
    Devvit.addCustomPostType({  
      render: (context) => {  
        const { products } = useProducts(context);  
        const payments = usePayments((result: OnPurchaseResult) => {  
          if (result.status === OrderResultStatus.Success) {  
            context.ui.showToast({  
              appearance: 'success',  
              text: 'Thanks for your support!',  
            });  
          } else {  
            context.ui.showToast(  
              `Purchase failed! Please try again.`  
            );  
          }  
        });  
       const supportProduct = products.find(products.find((p) => p.sku === 'support-app');  
       return (  
         <ProductButton  
           product={supportProduct}  
           onPress={(p) => payments.purchase(p.sku)}  
         />  
       );  
    })  
    

## Example​

At [r/BirbGame](https://www.reddit.com/r/BirbGame/), they created the Birb Club. Members can join the club and get exclusive flair to support the app.

![Birb gif](/docs/assets/images/support_birbclub-177516bc359c40d59f54648b6b0a9bd3.gif)

![Birb flair](/docs/assets/images/support_birbclub_flair-0c834b968319297b5115b3b9d04b9bd2.png)

  * Requirements
  * How to integrate app support
    * Create the product
    * Add a payment handler
    * Initiate purchases
  * Example