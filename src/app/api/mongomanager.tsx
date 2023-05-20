import { MongoClient, Db, MongoClientOptions, ServerApiVersion } from 'mongodb';

class MongoDBManager {
  private client: MongoClient;
  private db!: Db;
  private isConnected: boolean = false;

  constructor() {
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

    this.client = new MongoClient(mongoUrl,  {
      serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      }
    );
  }

  public async connect(): Promise<void> {
    if(this.isConnected) return;
    try {
      await this.client.connect();
      this.db = this.client.db();
      console.log('Connected to MongoDB');
      this.isConnected = true;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
    }
  }

  public async disconnect(): Promise<void> {
    if(!this.isConnected) return;
    try {
      await this.client.close();
      console.log('Disconnected from MongoDB');
      this.isConnected = false;
    } catch (error) {
      console.error('Failed to disconnect from MongoDB:', error);
    }
  }

  public toJSON(): object {
    this.connect(); // Automatically start the connection
    return {
      isConnected: this.isConnected,
    };
  }

  public getDB(): Db {
    if(!this.isConnected){
      this.connect();
    }
    return this.db;
  }
}


export default MongoDBManager;
