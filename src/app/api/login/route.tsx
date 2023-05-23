'use server'
import { NextRequest, NextResponse } from "next/server";
import MongoDBManager from "../mongomanager";
import jwt from "jsonwebtoken";

const Crypto = require('crypto')
const bcrypt = require('bcryptjs')

enum AuthCodeEvaluationResult {
    INTERNAL_ERROR = 'INTERNAL ERROR',
    SUCCESS = 'SUCCESS',
    CODE_EXPIRED = 'CODE EXPIRED',
    CODE_NOT_FOUND = 'CODE NOT FOUND',
}


class LoginHandler {
  private dbManager: MongoDBManager;
  private sgMail = require('@sendgrid/mail');
  constructor() {
    this.dbManager = new MongoDBManager();
    this.sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  public async issueAuthCode(email: string): Promise<void> {
    try {
      await this.dbManager.connect();

      const authCode = Math.floor(100000 + Math.random() * 900000); // Generate a random number

      const collection = this.dbManager.getDB().collection('logintokens'); // Assuming 'logintokens' is the collection name

      // Create the document to be inserted
      const document = {
        email,
        number: authCode,
        createdAt: new Date(),
        expireAt: new Date(new Date().getTime() + 10 * 60 * 1000), // 10 minutes expiration time
      };

      await collection.insertOne(document);


      const msg = {
        to: email,
        from: process.env.SENDGRID_EMAIL, // Use the email address or domain you verified above
        templateId: process.env.LOGINCODE_EMAILTEMPLATE,
        dynamicTemplateData: {
          "CODE": authCode
        }
      };
      this.sgMail.send(msg);

      console.log("*********\nIssued Authcode\n E-Mail:" + email + "\n Code: " + authCode +"\n*********")

    } catch (error) {
      console.error('Failed to save random number:', error);
    } finally {
      await this.dbManager.disconnect();
    }


  }

  public async evaluateAuthCode(email: string, code: string): Promise<AuthCodeEvaluationResult> {
    try {
      await this.dbManager.connect();

      const collection = this.dbManager.getDB().collection('logintokens'); // Assuming 'logintokens' is the collection name

      const document = await collection.findOne({
        email: email,
        number: Number(code)
      });

      console.log("Doc: ", document)

      if (document) {
        return AuthCodeEvaluationResult.SUCCESS; // Code is valid
      } else {
        const expiredDocument = await collection.findOne({ email, code }); // Check if the code exists but has expired

        if (expiredDocument) {
          return AuthCodeEvaluationResult.CODE_EXPIRED; // Code has expired
        } else {
          return AuthCodeEvaluationResult.CODE_NOT_FOUND; // Code not found
        }
      }
    } catch (error) {
      console.error('Failed to evaluate auth code:', error);
      return AuthCodeEvaluationResult.INTERNAL_ERROR;
    } finally {
      await this.dbManager.disconnect();
    }
  }

}


const loginHandler: LoginHandler = new LoginHandler();


export async function POST(req: Request) {

    const emailRegex = new RegExp(process.env.NEXT_PUBLIC_EMAIL_REGEX as string)

    const body = await req.json();

    if(!body.email){

        console.log("Returning Error on Router () because no E-Mail provided")
        return new NextResponse("No Email Provided",{status: 204});        
    
    }
    
    const mail: string = body.email;
    
    if(!emailRegex.test(mail)){
        return new NextResponse("Wrong E-Mail Regex", {status: 400});
    }

    const code: string = body.code;

    //Check if it is a code request (Code is part of Body)
    if(code){

      const loginStatus = await loginHandler.evaluateAuthCode(mail, code);

      console.log("*********\n Result of Request to /api/login (w/ AuthCode): \n Email: " + mail +  " \n LoginStatus: " + loginStatus + "\n*********");

      if(loginStatus==AuthCodeEvaluationResult.SUCCESS){


        
        return new NextResponse(loginStatus.toString()).headers.set("Set-Cookie", authToken);

      }

      return new NextResponse(loginStatus.toString());
      return;

    }

    loginHandler.issueAuthCode(mail);
    

    return new NextResponse("SUCCESS")

}