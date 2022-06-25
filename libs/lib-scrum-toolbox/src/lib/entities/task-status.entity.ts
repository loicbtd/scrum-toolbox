import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'task_status' })
export class TaskStatusEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;

  @Column({ length: '7' })
  backgroundColor: string;

  @Column({ length: '7' })
  textColor: string;
}
