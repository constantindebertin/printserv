"use server";

import { MongoClient, ServerApiVersion } from "mongodb";

export async function checkMongo(mongoUrl: string){

    const client = new MongoClient(mongoUrl,  {
      serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      }
    );

    try{
        client.connect()
    }catch{
       return false; 
    }

    return true;
}