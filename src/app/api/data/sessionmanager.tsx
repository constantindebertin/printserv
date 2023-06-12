'use server';
import { SignJWT, jwtVerify } from 'jose';
import cryptoRandomString from 'crypto-random-string';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUser } from './user/usermanager'


let SECRETKEY: Uint8Array;

const keyFilePath = path.resolve(__dirname, 'secretKey.json');

async function getSessionKey(forceReload = false): Promise<Uint8Array>{

    if(!forceReload && SECRETKEY){

        return SECRETKEY;

    }

    if(fs.existsSync(keyFilePath)){

        const secretKey = fs.readFileSync(keyFilePath, 'utf8');
        SECRETKEY = new TextEncoder().encode(secretKey);
        return SECRETKEY;
    
    }

    
    const randString = cryptoRandomString({length: 128});

    fs.writeFileSync(keyFilePath, randString);

    return new TextEncoder().encode(randString);
}

export async function issueSession(email: string, isAdmin?: boolean): Promise<string> {

    const user = await getUser(email);

    if(!user){
        createUser(email, isAdmin ? isAdmin : false);
    }

    if(isAdmin == null || isAdmin == undefined){

        isAdmin = user.isAdmin;

    }

    const authToken = await new SignJWT(
        {
            email: email,
            isAdmin: isAdmin

        }).setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // Set your own expiration time
        .sign(await getSessionKey());
    

    return authToken;
    
}

export async function verifySession(req: NextRequest): Promise<any>{

    const cookie = await req.cookies;

    if(cookie && (cookie.get('token'))){

        const tokenToVerify = cookie.get('token')!;

        console.log("VerifyToken", tokenToVerify);

        return verifySessionWithToken(tokenToVerify.value);

    }

    return {};
    
}

export async function verifySessionWithToken(token: string) {

    try {
        const { payload } = await jwtVerify(token, await getSessionKey());
    
        console.log(payload);

        return payload;
      } catch (error) {
        return null;
    }

}