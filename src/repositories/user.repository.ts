import { User, UserParams } from "@/entities/User";
import { EntityRepository, wrap } from "@mikro-orm/core";
import { GetOpts } from "@/repositories/helpers/type";
// import { validateEntity } from "./helpers/validator";
import { pick } from "lodash";

export class UserRepository extends EntityRepository<User> {
   async get(id: number, opts: GetOpts<User> = {}) {
      return this.findOne({ id }, opts);
    }

    async getAllUsers() {
      return this.findAll();
    }

    async createUser(params: Record<string, string | number>) {
      const userParams = pick(params, [
        "name",
        "email",
        "phone",
        "address",
      ]) as UserParams;

      const user = new User(userParams);

      // ? What em.getReference() does?

      // ? What validateEntity() does? >> and why it is now error?
      // await validateEntity(user);

      await this.em.persistAndFlush(user);

      return user;
    }

    async updateUser(user: User, params: Record<string, string | number>) {
      const userParams = pick(params, [
        "name",
        "email",
        "phone",
        "address",
      ]) as UserParams;

      wrap(user).assign(userParams);
      // ? Object.assign(user, userParams); >> Provided by autocomplete, what the difference?
      // The difference between Object.assign() and wrap().assign() is that
      // Object.assign() will only assign the properties that are not
      // already defined on the object, while wrap().assign() will
      // overwrite all properties regardless of whether they are already
      // defined on the object or not.

      // ? What validateEntity() does? >> and why it is now error?
      // await validateEntity(user);

      // ? This quite confusing?? how Mikro-orm does the update?
      await this.em.flush();

      return user;
    }

    async deleteUser(user: User) {
      return this.em.removeAndFlush(user);
    }
}


