
import {JsonValue, loadJsonFile, loadJsonFileSync} from 'load-json-file';
import {writeJsonFile} from 'write-json-file';
import fs from 'fs';
import MongoDBManager from '../mongomanager';
import { config } from 'process';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

enum ConfigValue {

    ERROR,
    //NOT STARTED is only for the ConfigurationStatus Method
    NOT_STARTED,
    MONGODB,
    ADMINEMAIL,
    SENDGRID_API,
    SENDGRID_EMAIL,
    CONFIGURATIONCOMPLETED,

}



class ConfigManger{

    public async configurationStatus(): Promise<ConfigValue>{

        if(!process.env.MONGODB_URI){
            return ConfigValue.NOT_STARTED;
        }

        if((await this.getConfigurationValue(ConfigValue.CONFIGURATIONCOMPLETED))){
            return ConfigValue.CONFIGURATIONCOMPLETED;
        }

        if(!(await this.getConfigurationValue(ConfigValue.ADMINEMAIL))){
            return ConfigValue.MONGODB;
        }

        if(!(await this.getConfigurationValue(ConfigValue.SENDGRID_API))){
            return ConfigValue.ADMINEMAIL;
        }

        if(!(await this.getConfigurationValue(ConfigValue.SENDGRID_EMAIL))){
            return ConfigValue.SENDGRID_EMAIL;
        }

        return ConfigValue.ERROR;

    }

    public async getConfigurationValue(value: ConfigValue): Promise<any>{

        if(value == ConfigValue.MONGODB){
            return process.env.MONGODB_URI;
        }

        if(value == ConfigValue.NOT_STARTED || value == ConfigValue.ERROR){

            console.error("Some Method tried to get an impossible Value from the Configuration");
            return "ERROR";

        }

        const dataManager = new MongoDBManager();

        await dataManager.connect();

        const configCollection = dataManager.getDB().collection("ConfigValues");

        const query = await configCollection.findOne({value: value.toString()});

        console.log("Result of Config Query (" + value.toString() + ")", query);

        dataManager.disconnect();

        if(query){
            return query.value;
        }

        return null;

    }

}

const configManager: ConfigManger = new ConfigManger();

export async function POST(req: Request) {

    const configStatus = await configManager.configurationStatus()

    const body = await req.json();

    if(!body) return new NextResponse("NO BODY")

    if(configStatus == ConfigValue.NOT_STARTED){



        if(body.mongodburi){

            //TODO: set env.local file to include the MongoDBURI, also generate Random JWT SECRETKEY and insert it into env.local (and restart the webserver)

        }


    }else{

        if(configStatus == ConfigValue.MONGODB){

            if(body.email){
                
                const authToken = jwt.sign({ email: body.email }, process.env.SESSIONKEY as string);

                cookies.set()

                return new NextResponse()

            }

        }

    }
     
    //TODO Add logic for changing the config later 

}

export async function GET(req: Request) {

    const configStatus = await configManager.configurationStatus()

    return new NextResponse(JSON.stringify({configstatus: configStatus.toString()}));

}