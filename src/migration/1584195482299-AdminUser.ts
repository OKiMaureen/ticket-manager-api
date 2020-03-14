import {MigrationInterface, QueryRunner, getRepository } from "typeorm";
import User from "../entity/User";

export class AdminUser1584097962374 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new User();
        user.firstName = "admin";
        user.lastName = "admin";
        user.userName = "adminuser";
        user.password = "admin";
        user.email = "admin@gmail.com";
        user.hashPassword();
        user.role = "admin";
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
