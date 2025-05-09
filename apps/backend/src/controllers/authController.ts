import { Request, Response } from 'express';
import { prismaClient } from '@repo/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateUsername = (email: string, phone: string): string => {
  // Generate a string by concatenating the first 4 characters of the email and phone
  const usernameBase = email.slice(0, 4) + phone.slice(0, 4);
  
  // Generate a random 8-character string, you can adjust the logic for your use case
  const randomPart = Math.random().toString(36).substring(2, 10); // Random 8 chars
  
  // Combine the base string with the random part
  const username = (usernameBase + randomPart).slice(0, 8); // Ensure it is 8 characters long

  return username;
};

export const signup = async (req: Request, res: Response) => {
  try {
    console.log('signup');
    const { email, fullName, phone, password } = req.body;
    console.log(email, fullName, phone, password);

    if (!email || !fullName || !phone || !password) {
      res.status(400).json({ 
        success: false, 
        message: 'Email, fullName, phone and password are required' 
      });
      return;
    }

   // Check if the email or phone is already in use
   const existingUserByEmail = await prismaClient.user.findUnique({
    where: { email },
  });
  const existingUserByPhone = await prismaClient.user.findUnique({
    where: { phone },
  });

  if (existingUserByEmail) {
    res.status(409).json({
      success: false,
      message: 'Email is already used.',
    });
    return;
  }

  if (existingUserByPhone) {
    res.status(409).json({
      success: false,
      message: 'Phone number is already used.',
    });
    return;
  }

   // Generate a unique username
   let username = generateUsername(email, phone);

   // Check if the generated username is unique
   let existingUserByUsername = await prismaClient.user.findUnique({
     where: { username },
   });

   // If username already exists, regenerate a new one
   while (existingUserByUsername) {
     username = generateUsername(email, phone);
     existingUserByUsername = await prismaClient.user.findUnique({
       where: { username },
     });
   }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await prismaClient.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'USER';

    const defaultPlan = await prismaClient.platformSubscriptionPlan.findFirst({
      where: {
        isActive: true,
        isDefault: true
      }
    });

    if (!defaultPlan) {
      res.status(500).json({
        success: false,
        message: 'No default subscription plan found'
      });
      return;
    }

    //  Calculate end date (default to 30 days if monthly billing)
    const startDate = new Date();
    const farFutureDate = new Date(startDate);
    farFutureDate.setFullYear(farFutureDate.getFullYear() + 100);

    const result = await prismaClient.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username,
          name: fullName,
          email,
          phone,
          password: hashedPassword,
          role
        }
      });

      await tx.wallet.create({
        data: {
          userId: newUser.id
        }
      });

      await tx.userPlatformSubscription.create({
        data: {
          userId: newUser.id,
          platformPlanId: defaultPlan.id,
          endDate: farFutureDate,
          currentPeriodStart: startDate,
          currentPeriodEnd: farFutureDate,
          billingCycle: 'LIFETIME', // Using LIFETIME billing cycle for infinite access
          status: 'ACTIVE'
        }
      })

      return { newUser };
    });

    const token = jwt.sign({
      id: result.newUser.id,
      username: result.newUser.username,
      email: result.newUser.email,
      phone: result.newUser.phone,
      role: result.newUser.role
    }, process.env.JWT_SECRET!);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: result.newUser.id,
          name: result.newUser.name,
          username: result.newUser.username,
          email: result.newUser.email,
          phone: result.newUser.phone,
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
    const { username, password, loginMethod } = req.body;
    
    const emailOrPhone = username;

    if (!emailOrPhone || !password || !loginMethod) {
      res.status(400).json({
        success: false,
        message: 'Email/Phone, password, and login method are required',
      });
      return ;
    }

    // Validate login method (either 'email' or 'phone')
    if (loginMethod !== 'email' && loginMethod !== 'phone') {
      res.status(400).json({
        success: false,
        message: 'Invalid login method',
      });
      return ;
    }


    // Find user by email or phone
    const user = await prismaClient.user.findUnique({
      where: loginMethod === 'email'
        ? { email: emailOrPhone } // Search by email
        : { phone: emailOrPhone }, // Search by phone
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return ;
    }

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
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }, process.env.JWT_SECRET!);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
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

export const updatePassword = async (req: Request, res: Response) => {
  try {   
    const userId = req.user?.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;
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
    if(!user || user.role !== "USER") {
        res.status(404).json({
            success: false,
            message: 'User not found or not an user'
        });
        return;
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password); 
      
    if(!isPasswordValid) {
        res.status(401).json({
            success: false,
            message: 'Invalid old password'
        });
        return;
    }
    if(newPassword !== confirmPassword) {
        res.status(400).json({
            success: false,
            message: 'New password and confirm password do not match'
        });
        return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prismaClient.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    }); 
    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    });
} catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
}
}
