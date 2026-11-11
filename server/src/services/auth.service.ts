import { prisma } from "../lib/prisma";
import { TokenType, UserDataType, VerifyUserDataType } from "../types/types";
import { AppError } from "../utils/app-error";
import { decodeRefreshToken, generateAccessToken, generateTokens, hashPassword, verifyPassword } from "../utils/auth.utils";

export async function createUserService(data: UserDataType) {
  const { email, password, username, mobile_no, alternative_mobile_no, name } = data;

  const existedUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });

  if (existedUser) {
    throw new AppError(existedUser.email === email ? "Email already exist" : "Username already exist", 403);
  }

  const hash_password = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email, username, hash_password, mobile_no, alternative_mobile_no, name
    },
    select: {
      id: true, email: true, username: true, mobile_no: true, alternative_mobile_no: true, name: true, user_role: true, createdAt: true
    },
  });

  return user;
}

export const verifyUserService = async (data: VerifyUserDataType) => {
  const { email, username, password } = data;

  if (!email || !username || !password) {
    throw new AppError("fill the correct values", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email }, { username }
      ],
    },
  });

  if (!user) {
    throw new AppError("Email or username does not exist", 404);
  }

  const verifiedPassword = await verifyPassword(user.hash_password, password);

  if (!verifiedPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const payload: TokenType = {
    id: user.id,
    role: user.user_role,
    username: user.username,
    email: user.email,
  };

  const { access_token, refresh_token } = await generateTokens(payload);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: { refresh_token: refresh_token },
  })

  const userData = {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    user_role: user.user_role,
  };

  return {
    user: userData,
    access_token,
    refresh_token
  };
};

export const generateNewAccessToken = async (refreshToken: string) => {
  if (refreshToken == null) {
    throw new AppError("login again!", 402);
  }

  let decoded = await decodeRefreshToken(refreshToken);

  if (typeof decoded === "string" || !decoded ||
    typeof decoded.id !== "string"
  ) {
     throw new AppError("token expire!, login again!", 402);
  }

  const user = await prisma.user.findFirst({
    where : {id : decoded.id}
  });

  if(user?.refresh_token != refreshToken){
    throw new AppError("user with wrong credintial!", 409);
  }

  const token = await generateAccessToken(decoded as TokenType);
  return token;
}