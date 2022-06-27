import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'sprint_status' })
export class SprintStatusEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;

  @Column({ length: '7' })
  backgroundColor?: string;

  @Column({ length: '7' })
  textColor?: string;
}
