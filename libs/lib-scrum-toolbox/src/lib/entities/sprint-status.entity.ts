import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SprintStatus {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;
}
