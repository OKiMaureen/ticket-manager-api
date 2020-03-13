import {Entity, PrimaryGeneratedColumn, OneToMany, Column} from "typeorm";
import Story from "./Story";

@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public firstName!: string;

    @Column()
    public lastName!: string;

    @Column()
    public email!: string;

    @Column()
    public password!: string;
    
    @Column('boolean', {default: false})
    public isAdmin?: boolean;

    @OneToMany(
        () => Story, 
        story => story.user, 
        { eager: true, cascade: true }
    )
    public stories!: Story[];


}
