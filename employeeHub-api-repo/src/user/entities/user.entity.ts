// src/users/user.entity.ts

import {
  Entity,
  PrimaryColumn,
  Column,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({
    name: 'user_id',
  })
  userId!: number;

  @Column({
    name: 'full_name',
  })
  fullName!: string;

  @Column()
  email!: string;

  @Column({
    name: 'password_hash',
  })
  passwordHash!: string;

  @Column({
    name: 'role_id',
  })
  roleId!: number;

  @Column({
    name: 'refresh_token_hash',
    nullable: true,
  })
  refreshTokenHash?: string;
}