import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    nullable: false,
    name: 'email',
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
    // select: false,
  })
  password: string;
}
