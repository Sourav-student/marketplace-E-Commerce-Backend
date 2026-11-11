import argon from 'argon2';
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from '../config/env';
import { TokenType } from '../types/types';

export async function hashPassword(password: string) {
  return argon.hash(password);
}

export async function verifyPassword(hashPassword: string, password: string) {
  return argon.verify(hashPassword, password);
}

export async function generateAccessToken(tokenData: TokenType) {
  return jwt.sign(tokenData,
    env.ACCESS_SECRET,
    { expiresIn: env.ACCESS_EXPIRE as SignOptions['expiresIn'] }
  )
}

export async function generateRefreshToken(tokenData: TokenType) {
  return jwt.sign(tokenData,
    env.REFRESH_SECRET,
    { expiresIn: env.REFRESH_EXPIRE as SignOptions['expiresIn'] }
  )
}

export async function generateTokens(payload : TokenType){
  const access_token = await generateAccessToken(payload);
  const refresh_token = await generateRefreshToken(payload);

  return {
    access_token, refresh_token
  }
}

export async function decodeJwtToken(accessToken : string){
  return jwt.verify(accessToken, env.ACCESS_SECRET);
}

export async function decodeRefreshToken(refreshToken:string) {
  return jwt.verify(refreshToken, env.REFRESH_SECRET);
}