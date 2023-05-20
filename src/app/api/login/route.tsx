'use server'
import { NextRequest, NextResponse } from "next/server";
import MongoDBManager from "../mongomanager";
import jwt from 'jsonwebtoken';

enum AuthCodeEvaluationResult {
  INTERNAL_ERROR = 'INTERNAL ERROR',
  SUCCESS = 'SUCCESS',
  CODE_EXPIRED = 'CODE EXPIRED',
  CODE_NOT_FOUND = 'CODE NOT FOUND',
}

class RandomNumberManager {
  private dbManager: MongoDBManager;
  private sgMail = require('@sendgrid/mail');
  constructor() {
    this.dbManager = new MongoDBManager();
    this.sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  
  public async saveRandomNumberWithEmail(email: string): Promise<void> {
    try {
      await this.dbManager.connect();

      const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate a random number

      const collection = this.dbManager.getDB().collection('logintokens'); // Assuming 'logintokens' is the collection name

      // Create the document to be inserted
      const document = {
        email,
        number: randomNumber,
        createdAt: new Date(),
        expireAt: new Date(new Date().getTime() + 10 * 60 * 1000), // 10 minutes expiration time
      };

      await collection.insertOne(document);
      console.log('Authcode (' + randomNumber +') generated for ' + email);


      const msg = {
        to: email,
        from: process.env.SENDGRID_EMAIL, // Use the email address or domain you verified above
        templateId: process.env.LOGINCODE_EMAILTEMPLATE,
        dynamicTemplateData: {
          "CODE": randomNumber
        }
      };
      this.sgMail.send(msg);

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


const rnManager: RandomNumberManager = new RandomNumberManager();

export async function POST(req: Request) {

    const body = await req.json()

    if(!body.email){

        console.log("Returning Error because no E-Mail provided")
        return new Response("No Email Provided",{status: 204});        
    
    }
    
    const mail: string = body.email;
    
    const code: string = body.code;

    console.log("CodeInput" + code)

    if(code){

      const loginStatus = await rnManager.evaluateAuthCode(mail, code);

      console.log("LoginStatus: " + loginStatus)

      if(loginStatus==AuthCodeEvaluationResult.SUCCESS){

        const authToken = jwt.sign({ email: mail }, process.env.SESSIONKEY as string);

        return new NextResponse(loginStatus.toString()).headers.set("Set-Cookie", authToken);

      }

      return new NextResponse(loginStatus.toString());
      return;

    }

    rnManager.saveRandomNumberWithEmail(mail);
    

    return new NextResponse("SUCCESS")

}