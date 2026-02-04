# media-uploads

Source: https://developers.reddit.com/docs/capabilities/server/media-uploads

On this page

warning

Apps can only display images hosted on Reddit

You can upload images to Reddit at runtime using the `media` capability. This is different than static images, which are part of your [assets](/docs/capabilities/blocks/app_image_assets).

Runtime images are useful for embedding images in RTJSON (Posts and Comments) as well as displaying them within an interactive post app.

## Enabling media uploads​

Enable the `media` permission in your `devvit.json` file.

devvit.json
    
    
    {  
      "permissions": {  
        "media": true  
      }  
    }  
    

## Using media uploads​

On the server, you can pass the URL of any remotely hosted image (even if its not hosted on Reddit) to the `media.upload` function. The media function will return a Reddit URL.

  * Devvit Web
  * Devvit Blocks / Mod Tools

server/index.ts
    
    
    import { media } from '@devvit/media';  
    function submitImage() {  
      const response = await media.upload({  
        url: 'https://media2.giphy.com/media/xTiN0CNHgoRf1Ha7CM/giphy.gif',  
        type: 'gif',  
      });  
    }  
    
    
    
    import { Devvit } from '@devvit/public-api';  
      
    const response = await media.upload({  
      url: 'https://media2.giphy.com/media/xTiN0CNHgoRf1Ha7CM/giphy.gif',  
      type: 'gif',  
    });  
    

## Limitations​

Supported file types are:

  * GIF
  * PNG
  * JPEG

Maximum size is 20 MB.

  * Enabling media uploads
  * Using media uploads
  * Limitations