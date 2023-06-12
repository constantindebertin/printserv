import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('UserInfo')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column({ default: false })
    isAdmin!: boolean;

    @Column({ default: false })
    isBanned!: boolean;

    @UpdateDateColumn()
    lastRequest!: Date;
}

export function createUserObj(email: string, isAdmin: boolean, isBanned: boolean): User{

    const res = new User();
    res.email = email;
    res.isAdmin = isAdmin;
    res.isBanned = isBanned;
    
    return res;

}