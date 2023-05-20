'use server'
import { NextRequest, NextResponse } from "next/server";
import MongoDBManager from "../mongomanager";

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
      console.log('Random number saved successfully');


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
}


const rnManager: RandomNumberManager = new RandomNumberManager();

export async function POST(req: Request) {

    const body = await req.json()

    if(!body.email){

        console.log("Returning Error because no E-Mail provided")
        return new Response("No Email Provided",{status: 204});        
    
    }
    
    const mail: string = body.email;
    
    console.log(mail)

    rnManager.saveRandomNumberWithEmail(mail);
    

    return new NextResponse("Testing")

}
