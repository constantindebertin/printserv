'use server'
import { NextRequest, NextResponse } from "next/server";
import { issueSession } from "../data/sessionmanager";
import { evaluateAuthCode, AuthCodeEvaluationResult } from "../data/authcode/authcodemanager";
import { issueAuthCode, AuthCodeIssueingResult } from '../data/authcode/authcodemanager';

export async function POST(req: Request) {

    const emailRegex = new RegExp(process.env.NEXT_PUBLIC_EMAIL_REGEX as string)

    const body = await req.json();

    if(!body.email){

        console.log("Returning Error on Router () because no E-Mail provided")
        return new NextResponse("No Email Provided", {status: 204});        
    
    }
    
    const mail: string = body.email;
    
    if(!emailRegex.test(mail)){
        return new NextResponse("Wrong E-Mail Regex", {status: 400});
    }

    const code: string = body.code;

    //Check if it is a code request (Code is part of Body)
    if(code){

      const loginStatus = await evaluateAuthCode(mail, code);

      console.log("*********\n Result of Request to /api/login (w/ AuthCode): \n Email: " + mail +  " \n LoginStatus: " + loginStatus + "\n*********");

      if(loginStatus==AuthCodeEvaluationResult.SUCCESS){

        const authToken = await issueSession(mail)
        
        const response = new NextResponse(loginStatus.toString());

        response.cookies.set(
          {
            name: "token", 
            value: authToken
          });
      }

      return new NextResponse(loginStatus.toString());
      return;

    }

    issueAuthCode(mail);
    

    return new NextResponse("SUCCESS")

}