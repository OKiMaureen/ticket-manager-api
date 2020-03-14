import {Entity, PrimaryGeneratedColumn, OneToMany, Column} from "typeorm";
import { Length, IsNotEmpty, IsEmail, MinLength,IsEnum } from "class-validator";
import * as bcrypt from "bcrypt";
import Story from "./Story";

@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({
    type: "varchar",
    length: 20,
    unique: true,
    })
    @Length(4, 20)
    @IsNotEmpty()
    public userName!: string;

    @Column({
    unique: true,
    })
    @IsEmail(undefined,{ message: "Provide a valid email address"})
    @IsNotEmpty({message: "Email address is required."})
    public email!: string;

    @Column()
    @Length(4, 100)
    @IsNotEmpty()
    public password!: string;
    
    @Column({
    default:"user"
    })
    public role!: string;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password.trim(), 10);
    }
    
    checkPassword(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }


    @OneToMany(
        () => Story, 
        story => story.user, 
        { eager: true, cascade: true }
    )
    public stories!: Story[];


}
