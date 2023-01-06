import { Request, Response } from "express";
import httpStatus from "http-status";
import axios from "axios";
import dotenv from "dotenv";
import { Prisma } from "@prisma/client";
import { createSession, findUserByEmail, createGitHubUser } from "../services/authentication-githublogin-service/index";
dotenv.config();

async function exchangeCodeForAccessToken(code: string) {
  const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
  const { CLIENT_ID, REDIRECT_URL, CLIENT_SECRET } = process.env;
  const body = {
    code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, body, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  const parsedData = data.slice(13, 53);
  return parsedData;
}

async function fetchUser(token: string) {
  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

export async function singInGitHubPost(req: Request, res: Response) {
  try {
    const token = await exchangeCodeForAccessToken(req.body.code);
    const user = await fetchUser(token);
    const loginInfo = {
      email: `${user.login}@github`,
      password: "",
    } as Prisma.UserUncheckedCreateInput;
    const email = `${user.login}@github`;
    const password = "";

    const checkIfEmailExists = await findUserByEmail(email);
    if(!checkIfEmailExists) {
      await createGitHubUser(loginInfo);
    }
    
    const tokenDrivent = await createSession(checkIfEmailExists.id);
    const body = {
      id: checkIfEmailExists.id,
      email: checkIfEmailExists.email,
      token: tokenDrivent,
    };
    return res.status(httpStatus.OK).send(body);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}
