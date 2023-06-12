'use server';
import { createConnection, getConnection, Connection } from 'typeorm';
import fs from 'fs';
import path from 'path';

const configFilePath = path.resolve(__dirname, 'dbConfig.json');

export async function saveDatabaseConfiguration(connectionOptions: any): Promise<void> {
    fs.writeFileSync(configFilePath, JSON.stringify(connectionOptions, null, 2));
}

export async function getDatabaseConfiguration(): Promise<any> {
    const configFileContent = fs.readFileSync(configFilePath, 'utf8');
    return JSON.parse(configFileContent);
}

export async function getDatabaseConnection(connectionOptions?: any): Promise<Connection> {
    let connection: Connection;
    
    if(!connectionOptions){
        if (fs.existsSync(configFilePath)) {
            connectionOptions = await getDatabaseConfiguration();
        } else {
            throw new Error('No database configuration file found.');
        }
    }

    try {
        // Try to get the existing connection
        connection = getConnection();
    } catch (error) {
        // If connection does not exist, create a new one
        connection = await createConnection({ ...connectionOptions });
    }

    // If connection isn't connected, connect it
    if (!connection.isConnected) {
        connection = await connection.connect();
    }

    return connection;
}
