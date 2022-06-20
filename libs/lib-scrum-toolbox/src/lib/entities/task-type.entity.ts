import 'reflect-metadata';

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TaskType {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;

  @Column({ length: '7' })
  backgroundColor: string;

  @Column({ length: '7' })
  textColor: string;
}
