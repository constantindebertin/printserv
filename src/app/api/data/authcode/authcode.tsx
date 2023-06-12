import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('AuthCode')
export class AuthCode {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: false })
    email!: string;

    @Column({ default: false })
    authCode!: number;

    @Column({ type: 'datetime', nullable: true })
    expiresAt!: Date;
}
