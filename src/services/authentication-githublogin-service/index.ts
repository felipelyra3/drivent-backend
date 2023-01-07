import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

export async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

export async function findUserByEmail(email: string) {
  const user = await userRepository.findByEmail(email);
  return user;
}

export async function createGitHubUser(login: Prisma.UserUncheckedCreateInput) {
  await userRepository.create(login);
  return;
}
