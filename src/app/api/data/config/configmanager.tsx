import { Configuration } from './config';
import { getDatabaseConnection } from '../databsemanager';

export async function createConfiguration(option: string, value: string): Promise<Configuration> {
    const connection = await getDatabaseConnection();
    const configurationRepository = connection.getRepository(Configuration);
    const configuration = configurationRepository.create({ option, value });
    return configurationRepository.save(configuration);
}

export async function getConfiguration(option: string): Promise<Configuration | undefined> {
    const connection = await getDatabaseConnection();
    const res = await connection.getRepository(Configuration).findOne({ where: { option } });
    return res ? res : undefined;
}

export async function updateConfiguration(option: string, value: string): Promise<void> {
    const connection = await getDatabaseConnection();
    const configurationRepository = connection.getRepository(Configuration);
    await configurationRepository.update({ option }, { value });
}
