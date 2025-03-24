import { Request, Response } from "express";
import prisma from "../utils/db";

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

    const link = await prisma.link.create({
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

    
    const links = await prisma.link.findMany({
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

    const link = await prisma.link.findUnique({
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

    
    await prisma.link.update({
      where: {
        id: link.id,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });

    // Redirect to the original URL
    res.redirect(link.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to redirect",
    });
  }
};

export const getLinkStats = async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;
    
    const link = await prisma.link.findUnique({
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

    
    const link = await prisma.link.findUnique({
      where: { id },
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

    await prisma.link.delete({
      where: { id },
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
