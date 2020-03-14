import {Entity, PrimaryGeneratedColumn, ManyToOne, Column} from "typeorm";
import User from "./User";


export enum TicketStatus {
    APPROVED="approved",
    REJECTED="rejected",
    PENDING="pending"
  }

@Entity()
export default class Story {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public summary!: string;

    @Column()
    public description!: string;

    @Column()
    public type!: string;

    @Column()
    public complexity!: number;
    
    @Column()
    public estimatedTime!: Date;

    @Column({
        type: "enum",
        enum: TicketStatus,
        default: TicketStatus.PENDING
    })
    public ticketStatus!: TicketStatus;

    @Column()
    public assignedTo!: number;

    @Column()
    public readonly createdAt?: Date;

    @Column()
    public readonly updatedAt?: Date;

    @ManyToOne(
        () => User, 
        user  => user.stories, 
    )
    public user!: User

}
