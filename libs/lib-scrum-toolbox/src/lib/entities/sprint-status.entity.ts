import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SprintStatus {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  label?: string;

  @Column({ length: '7' })
  backgroundColor?: string;

  @Column({ length: '7' })
  textColor?: string;
}
