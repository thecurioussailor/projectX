import { Request, Response } from "express";
import { prismaClient } from '@repo/db';

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    
    const user = await prismaClient.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        profileImage: true,
        coverImage: true,
        location: true,
        emailVerified: true,
        wallet: true,
        createdAt: true
      }
    });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    
    const { name, email, phone, profileImage, coverImage, location } = req.body;
    
    const updatedUser = await prismaClient.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(profileImage && { profileImage }),
        ...(coverImage && { coverImage }),
        ...(location && { location })
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        profileImage: true,
        coverImage: true,
        location: true,
        emailVerified: true,
        wallet: true,
        createdAt: true
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Email or phone number already in use'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        emailVerified: true,
        createdAt: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
      return;
    }
    
    const user = await prismaClient.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        emailVerified: true,
        createdAt: true
      }
    });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
      return;
    }
    
    // Check if user exists
    const existingUser = await prismaClient.user.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    // Prevent deleting the last admin
    if (existingUser.role === 'ADMIN') {
      const adminCount = await prismaClient.user.count({
        where: { role: 'ADMIN' }
      });
      
      if (adminCount <= 1) {
        res.status(403).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
        return;
      }
    }
    
    // Delete user
    await prismaClient.user.delete({
      where: { id: Number(id) }
    });
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

