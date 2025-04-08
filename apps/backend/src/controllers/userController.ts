import { Request, Response } from "express";
import { prismaClient } from '@repo/db';
import crypto from "crypto";
import dotenv from "dotenv";
import { PutObjectCommand, S3Client, HeadObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

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
    
    const { name, email, phone, location } = req.body;
    
    const isPhoneUnique = await prismaClient.user.findUnique({
      where: { phone }
    });

    if(isPhoneUnique) {
      if(isPhoneUnique.id !== req.user.id) {  
        res.status(400).json({
          success: false, 
          message: 'Phone number already in use'
        });
        return;
      }
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(location && { location })
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        location: true,
        emailVerified: true,
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

export const getProfileUploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const s3Key = `${userId}/profile/${fileName}-${crypto.randomUUID()}-${Date.now()}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600 // 1 hour
    });

    res.status(200).json({
      success: true,
      data: {
        url: signedUrl,
        key: s3Key
      }
    });
  } catch (error) {
    console.error('Get profile upload URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getProfilePicture = async (req:Request, res:Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { profileImage: true }
    }); 

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const profilePicture = user.profileImage;

    if (!profilePicture) {
      res.status(404).json({
        success: false,
        message: 'Profile picture not found'    
      });
      return;
    }
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: profilePicture
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600 // 1 hour
    });
    res.status(200).json({
      success: true,
      data: {
        url: signedUrl
      }
    });
  } catch (error) {
    console.error('Get profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const deleteProfilePicture = async (req:Request, res:Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { profileImage: true }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const profilePicture = user.profileImage;

    if (!profilePicture) {
      res.status(404).json({
        success: false,
        message: 'Profile picture not found'
      });
      return;
    }

    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: profilePicture
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getCoverUploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const s3Key = `${userId}/cover/${fileName}-${crypto.randomUUID()}-${Date.now()}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600 // 1 hour
    });

    res.status(200).json({
      success: true,
      data: {
        url: signedUrl,
        key: s3Key
      }
    });
  } catch (error) {
    console.error('Get cover upload URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const { s3Key } = req.body;
    console.log(s3Key);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const headParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key
    }

    await s3Client.send(new HeadObjectCommand(headParams));    

    const currentUser = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        profileImage: true
      }
    });

    if (currentUser?.profileImage) {
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: currentUser.profileImage
      };

      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        profileImage: s3Key
      }
    });

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const updateCoverPicture = async (req: Request, res: Response) => {
  try {
    const { s3Key } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const headParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key
    }

    await s3Client.send(new HeadObjectCommand(headParams));

    const currentUser = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        coverImage: true
      }
    });

    if (currentUser?.coverImage) {
      try {
        const deleteParams = {
          Bucket: BUCKET_NAME,
          Key: currentUser.coverImage
        };  

        await s3Client.send(new DeleteObjectCommand(deleteParams));
      } catch (error) {
        console.error('Delete cover picture error:', error);
      }
    } 
    
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        coverImage: s3Key
      }
    });

    res.status(200).json({
      success: true,
      message: 'Cover picture uploaded successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Upload cover picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getCoverPicture = async (req:Request, res:Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { coverImage: true }
    });

    if (!user) {
      res.status(404).json({
        success: false, 
        message: 'User not found'
      });
      return;
    }

    const coverPicture = user.coverImage;

    if (!coverPicture) {
      res.status(404).json({
        success: false,
        message: 'Cover picture not found'
      });
      return;
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: coverPicture
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600 // 1 hour
    }); 

    res.status(200).json({
      success: true,
      data: {
        url: signedUrl
      }
    }); 
  } catch (error) {
    console.error('Get cover picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const deleteCoverPicture = async (req:Request, res:Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false, 
        message: 'Unauthorized'
      });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },  
      select: { coverImage: true }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found' 
      });
      return;
    }

    const coverPicture = user.coverImage;

    if (!coverPicture) {
      res.status(404).json({
        success: false, 
        message: 'Cover picture not found'
      });
      return;
    }

    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: coverPicture
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    res.status(200).json({
      success: true,
      message: 'Cover picture deleted successfully'
    }); 
  } catch (error) {
    console.error('Delete cover picture error:', error);
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

