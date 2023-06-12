'use server';
import { getConfiguration } from "./config/configmanager";

export const sgMail = require('@sendgrid/mail');

export async function getMailHandler(customKey = ""): Promise<any>{

    if(customKey != ""){
    
        sgMail.setApiKey(customKey)
    
    }else{
    
        const configKey = await getConfiguration("sg_ApiKey");
        if(configKey != undefined){
            sgMail.setApiKey(configKey);
        }
        return "Error";
    
    }

    return sgMail;
}

enum SendMailResult{
    SUCCESS,
    TEMPLATE_UNKNOWN,
    MAILHANDLER_ERROR,
    FROMMAIL_UNKNOWN,
    SENDERROR
}

export async function sendLoginMail(email: string, authCode: number){

    const mailHandler = await getMailHandler();
    if(mailHandler == "Error"){
        return SendMailResult.MAILHANDLER_ERROR;
    }

    const fromMail = await getConfiguration("sg_SendMail")
    if(fromMail == undefined){
        return SendMailResult.FROMMAIL_UNKNOWN;
    }

    const templateID = await getConfiguration("sg_LoginTemplate")
    if(templateID == undefined){
        return SendMailResult.TEMPLATE_UNKNOWN;
    }

    try{

        const msg = {
            to: email,
            from: fromMail, // Use the email address or domain you verified above
            templateId: templateID,
            dynamicTemplateData: {
              "CODE": authCode
            }
        };
        mailHandler.send(msg);

    }catch(err){

        console.error("Error (sendLoginMail:mailhandler.tsx)", err)
        return SendMailResult.SENDERROR;

    }

    return SendMailResult.SUCCESS;

}