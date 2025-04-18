import { Request, Response } from "express";
import { prismaClient } from "@repo/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminSignin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
    
        if (!username || !password) {
          res.status(400).json({ 
            success: false, 
            message: 'Username and password are required' 
          });
          return;
        }
    
        const user = await prismaClient.user.findUnique({
          where: { username }
        });
    
        if (!user || user.role !== "ADMIN") {
            res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials or user is not an admin' 
          });
          return;
        }
    
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
          });
          return;
        }
    
        const token = jwt.sign({
          id: user.id,
          username: user.username,
          role: user.role
        }, process.env.JWT_SECRET!);
    
        res.status(200).json({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: user.id,
              username: user.username,
              role: user.role
            },
            token
          }
        });
      } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Internal server error' 
        });
      }
}

export const adminProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if(!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });

        if(!user || user.role !== "ADMIN") {
            res.status(404).json({
                success: false,
                message: 'User not found or not an admin'
            });
            return;
        }
        res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        data: user
    });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
