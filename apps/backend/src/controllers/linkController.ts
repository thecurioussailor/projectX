import { Request, Response } from "express";
import { prismaClient } from "@repo/db";

// Custom function to generate a random short ID
const generateShortId = (length = 8) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const createLink = async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      res.status(400).json({
        status: "error",
        message: "Original URL is required",
      });
      return;
    }

    // Generate a short ID
    const shortId = generateShortId();
    
    // Create full short URL
    const baseUrl = `${req.protocol}://${req.get("host")}/api/v1/links`;
    const shortUrl = `${baseUrl}/${shortId}`;

    const link = await prismaClient.link.create({
      data: {
        originalUrl,
        shortId,
        shortUrl,
        userId: req.user?.id || null, // Associate with user if authenticated
      },
    });

   res.status(201).json({
      status: "success",
      data: link,
    });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create short link",
    });
  }
};

export const getUserLinks = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
      return;
    }

    
    const links = await prismaClient.link.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      status: "success",
      data: links,
    });
  } catch (error) {
    console.error("Error fetching user links:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch links",
    });
  }
};

export const redirectToOriginalUrl = async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;

    const link = await prismaClient.link.findUnique({
      where: {
        shortId,
      },
    });

    if (!link) {
      res.status(404).json({
        status: "error",
        message: "Link not found",
      });
      return;
    }

    
    await prismaClient.link.update({
      where: {
        id: link.id,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
    console.log(req.body)
    console.log(req.headers)
    const ipAddress = req.ip;
    const host = req.headers['host'];
    const userAgent = req.headers['user-agent'];
    const referer = req.headers['referer'];
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const screenWidth = req.body.screenWidth;
    const screenHeight = req.body.screenHeight;
    const browser = req.headers['sec-ch-ua'];
    const operatingSystem = req.headers['sec-ch-ua-platform'];
    const device = req.headers['sec-ch-ua-mobile'];
    const language = req.headers['accept-language'];
    const country = req.headers['cf-ipcountry'];
    const city = req.headers['cf-ipcity'];
    const region = req.headers['cf-ipcountryregion'];

    console.log({
      ipAddress,
      host,
      userAgent,
      referer,
      latitude,
      longitude,
      screenWidth,
      screenHeight, 
      browser,
      operatingSystem,
      device,
      language,
      country,
      city,
    })
    const clickAnalytics = await prismaClient.clickAnalytics.create({
      data: {
        linkId: link.id,
        ipAddress: ipAddress,
        host: host,
        userAgent: userAgent,
        referer: referer,
        latitude: latitude,
        longitude: longitude,
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        browser: browser as string,
        operatingSystem: operatingSystem as string,
        device: device as string,
        language: language as string,
        country: country as string,
        city: city as string,
        region: region as string,
      },
    });
    console.log(clickAnalytics)
    // res.send(`
    //   <!DOCTYPE html>
    //   <html>
    //   <head>
    //     <title>Redirecting...</title>
    //     <meta name="robots" content="noindex, nofollow">
    //     <style>
    //       body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
    //       .loader { width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto; }
    //       @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    //     </style>
    //   </head>
    //   <body>
    //     <div class="loader"></div>
    //     <p>Redirecting you to your destination...</p>
        
    //     <script>
    //       // Try to get location data
    //       function getLocationAndRedirect() {
    //         const finalUrl = ${JSON.stringify(link.originalUrl)};
    //         const trackingId = ${JSON.stringify(clickAnalytics.id)};
    //         const apiBaseUrl = ${JSON.stringify(`${req.protocol}://${req.get("host")}/api/v1/links`)};
            
    //         // Function to send data and redirect
    //         function sendDataAndRedirect(locationData = null) {
    //           // Send data back to the server
    //           fetch(apiBaseUrl + '/analytics/track', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //               trackingId: trackingId,
    //               location: locationData,
    //               screenWidth: window.innerWidth,
    //               screenHeight: window.innerHeight,
    //               language: navigator.language,
    //               platform: navigator.platform
    //             }),
    //             // Use keepalive to ensure the request completes even after navigating away
    //             keepalive: true
    //           }).catch(e => console.error('Error sending tracking data:', e));
              
    //           // Redirect to the final destination
    //           window.location.href = finalUrl;
    //         }
            
    //         // Try to get geolocation
    //         if (navigator.geolocation) {
    //           // Set a timeout in case geolocation permission is not granted quickly
    //           const timeoutId = setTimeout(() => {
    //             sendDataAndRedirect();
    //           }, 3000);
              
    //           navigator.geolocation.getCurrentPosition(
    //             function(position) {
    //               clearTimeout(timeoutId);
    //               const locationData = {
    //                 latitude: position.coords.latitude,
    //                 longitude: position.coords.longitude,
    //                 accuracy: position.coords.accuracy
    //               };
    //               sendDataAndRedirect(locationData);
    //             },
    //             function(error) {
    //               clearTimeout(timeoutId);
    //               sendDataAndRedirect();
    //             },
    //             { timeout: 5000, enableHighAccuracy: false }
    //           );
    //         } else {
    //           // Geolocation not supported
    //           sendDataAndRedirect();
    //         }
    //       }
          
    //       // Start the process
    //       getLocationAndRedirect();
    //     </script>
    //   </body>
    //   </html>
    // `);
    res.redirect(link.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to redirect",
    });
  }
};

export const trackAnalytics = async (req: Request, res: Response) => {
  try {
    const { trackingId, location, screenWidth, screenHeight, language, platform } = req.body;
    
    if (!trackingId) {
      res.status(400).json({
        status: "error",
        message: "Tracking ID is required",
      });
      return;
    }
    
    // Update the existing click analytics record with the new data
    await prismaClient.clickAnalytics.update({
      where: {
        id: trackingId,
      },
      data: {
        latitude: location?.latitude,
        longitude: location?.longitude,
        screenWidth,
        screenHeight,
        language,
      },
    });
    
    // Respond with a small 1x1 transparent GIF (minimal response)
    const transparentPixelGif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': transparentPixelGif.length,
    });
    res.end(transparentPixelGif);
  } catch (error) {
    console.error("Error tracking analytics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to track analytics",
    });
  }
};

export const getLinkStats = async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;
    
    const link = await prismaClient.link.findUnique({
      where: {
        shortId,
      },
    });

    if (!link) {
      res.status(404).json({
        status: "error",
        message: "Link not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        shortId: link.shortId,
        shortUrl: link.shortUrl,
        originalUrl: link.originalUrl,
        clicks: link.clicks,
        createdAt: link.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching link stats:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch link statistics",
    });
  }
};

export const deleteLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    
    const link = await prismaClient.link.findUnique({
      where: { id },
      include: {
        analytics: true,
      },
    });

    if (!link) {
      res.status(404).json({
        status: "error",
        message: "Link not found",
      });
      return;
    }

    // Check if user owns the link
    if (link.userId && req.user?.id && link.userId !== req.user.id) {
      res.status(403).json({
        status: "error",
        message: "You don't have permission to delete this link",
      });
      return;
    }

    await prismaClient.$transaction(async (tx) => {
      await tx.clickAnalytics.deleteMany({
        where: {
          linkId: link.id,
        },
      });
      await tx.link.delete({
        where: { id },
      });
    });

   res.status(200).json({
      status: "success",
      message: "Link deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete link",
    });
  }
};
