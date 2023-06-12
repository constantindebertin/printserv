import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Configuration')
export class Configuration {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', nullable: true })
    option!: string;

    @Column({ type: 'text', nullable: true })
    value!: string;
}