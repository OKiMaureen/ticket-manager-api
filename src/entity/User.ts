import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
} from 'typeorm';
import {
  Length,
  IsNotEmpty,
  IsEmail,
  IsAlphanumeric,
  IsAlpha,
} from 'class-validator';
import * as bcrypt from 'bcrypt';
import Story from './Story';

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({
      type: 'varchar',
      length: 20,
    })
    @IsAlpha(undefined, { message: 'Firstname must be alphabetic.' })
    @Length(3, 20, { message: 'Firstname must be between 3 and 20 characters.' })
    @IsNotEmpty({ message: 'Firstname is required.' })
    public firstName!: string;

    @Column({
      type: 'varchar',
      length: 20,
    })
    @IsAlpha(undefined, { message: 'Lastname must be alphabetic.' })
    @Length(3, 20, { message: 'Lastname must be between 3 and 20 characters.' })
    @IsNotEmpty({ message: 'Lastname is required.' })
    public lastName!: string;

    @Column({
      type: 'varchar',
      length: 20,
      unique: true,
    })
    @IsAlphanumeric(undefined, { message: 'Username must be alphanumeric.' })
    @Length(3, 20, { message: 'Username must be between 3 and 20 characters.' })
    @IsNotEmpty({ message: 'Username is required.' })
    public userName!: string;

    @Column({
      unique: true,
    })
    @IsEmail(undefined, { message: 'Provide a valid email address' })
    @IsNotEmpty({ message: 'Email address is required.' })
    public email!: string;

    @Column()
    @Length(4, 1000000, { message: 'Password must be more than 4 characters.' })
    @IsNotEmpty({ message: 'Password is required.' })
    public password!: string;

    @Column({
      default: 'user',
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
      (story) => story.user,
      { eager: true, cascade: true },
    )
    public stories!: Story[]
}
