import { getDatabaseConnection } from '../databsemanager'; // Assuming this is the file with the previously defined methods.
import { User, createUserObj } from './user'; // The User entity defined above.

    export async function getUser(email: string): Promise<User> {
        const connection = await getDatabaseConnection();
        const user = await connection.getRepository(User).findOne({ where: { email } });
        
        if(user){
            return user;
        }

        createUser(email, false, false);
        
        return user ? user : createUserObj(email, false, false);
    }

    export async function updateUserLastRequest(email: string, lastRequest: Date): Promise<void> {
        const connection = await getDatabaseConnection();
        const userRepository = connection.getRepository(User);
        await userRepository.update({ email }, { lastRequest });
    }

    export async function createUser(email: string, isAdmin = false, isBanned = false): Promise<User> {
        const connection = await getDatabaseConnection();
        const userRepository = connection.getRepository(User);
        const user = userRepository.create({ email, isAdmin, isBanned });
        return userRepository.save(user);
    }

    export async function setIsBanned(email: string, isBanned: boolean): Promise<void> {
        const connection = await getDatabaseConnection();
        const userRepository = connection.getRepository(User);
        await userRepository.update({ email }, { isBanned });
    }

    export async function setAdmin(email: string, isAdmin: boolean): Promise<void> {
        const connection = await getDatabaseConnection();
        const userRepository = connection.getRepository(User);
        await userRepository.update({ email }, { isAdmin });
    }


