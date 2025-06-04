import { Request, Response } from "express";
import { prismaClient } from "@repo/db";

export const getNotifications = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 10 } = req.query;
      
      const notifications = await prismaClient.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit),
      });
  
      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications'
      });
    }
  };
  
  export const markAsRead = async (req: Request, res: Response) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.id;
  
      await prismaClient.notification.update({
        where: { 
          id: notificationId,
          userId // Ensure user can only mark their own notifications
        },
        data: { isRead: true }
      });
  
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read'
      });
    }
  };
  
  export const markAllAsRead = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
  
      await prismaClient.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
  
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read'
      });
    }
  };
  
  export const getUnreadCount = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      const count = await prismaClient.notification.count({
        where: { userId, isRead: false }
      });
  
      res.json({
        success: true,
        data: { unreadCount: count }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get unread count'
      });
    }
  };
  
  // Helper function to create notifications
  export const createNotification = async (
    userId: string,
    title: string,
    message: string,
    type: string,
    data?: any
  ) => {
    try {
      await prismaClient.notification.create({
        data: {
          userId: parseInt(userId),
          title,
          message,
          type: type as any,
          data
        }
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };
