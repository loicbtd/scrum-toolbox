import { Application, DatabasesService, dependencies } from '@libraries/lib-electron';
import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs, errorsName, SignupRequest, UserEntity } from '@libraries/lib-scrum-toolbox';
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from 'typeorm';

export class SignupHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.signup;

  async handle(data: SignupRequest): Promise<UserEntity> {
    try {
      const user: UserEntity = {
        username: data.username,
        passwordHash: await bcrypt.hash(data.password, bcrypt.genSaltSync()),
        firstname: data.firstname,
        lastname: data.lastname,
        isActivated: true,
      };

      await Application.getInstance()
        .dependencies.get<DatabasesService>(dependencies.databases)
        .getConnection('main')
        .getRepository<UserEntity>(UserEntity)
        .insert(user);

      return user;
    } catch (error: any) {
      if (error instanceof QueryFailedError) {
        throw new Error(errorsName.usernameAlreadyExists);
      }
      throw error;
    }
  }
}
