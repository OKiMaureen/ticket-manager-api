import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { IsNumber } from 'class-validator';
import User from './User';

export enum TicketStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
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

    @IsNumber(undefined, { message: 'Complexity should be a number.' })
    @Column()
    public complexity!: number;

    @IsNumber(undefined, { message: 'Estimated finish time should be a number.' })
    @Column()
    public estimatedFinishTimeInMins!: number;

    @IsNumber(undefined, { message: 'Cost should be a number.' })
    @Column()
    public cost!: number;

    @Column({
      type: 'enum',
      enum: TicketStatus,
      default: TicketStatus.PENDING,
    })
    public ticketStatus!: TicketStatus;

    @ManyToOne(() => User)

    @JoinColumn({name: "assigneeId"})
    public assignee!: User;

    @ManyToOne(
      () => User,
      (user) => user.stories,
    )
    public user!: User;
}
