import { Request, Response } from 'express';
import { prismaClient } from '@repo/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signup = async (req: Request, res: Response) => {
  try {
    console.log('signup');
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
      return;
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { username }
    });

    if (existingUser) {
       res.status(409).json({ 
        success: false, 
        message: 'Username already taken' 
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await prismaClient.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'USER';

    const result = await prismaClient.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
          role
        }
      });

      await tx.wallet.create({
        data: {
          userId: newUser.id
        }
      });

      return { newUser };
    });

    const token = jwt.sign({
      id: result.newUser.id,
      username: result.newUser.username,
      role: result.newUser.role
    }, process.env.JWT_SECRET!);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: result.newUser.id,
          username: result.newUser.username,
          role: result.newUser.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export const signin = async (req: Request, res: Response) => {
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

    if (!user) {
        res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
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
};
