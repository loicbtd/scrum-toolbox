import { TaskEntity } from '../entities/task.entity';

export class UserModel {
  id?: string;

  username?: string;

  firstname?: string;

  lastname?: string;

  createdAt?: Date;

  isActivated?: boolean;

  tasks?: TaskEntity[];
}
