import { UserRepository } from '@/repositories/user.repository';
import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core';


export interface UserParams {
   name: string;
   email: string;
   phone: string;
   address: string;
}

@Entity(({ repository: () => UserRepository }))
export class User {
   [EntityRepositoryType]?: UserRepository;

   @PrimaryKey()
   id!: number;

   @Property()
   name!: string;

   @Property()
   email!: string;

   @Property()
   phone!: string;

   @Property()
   address!: string;

   constructor({ name, email, phone, address }: UserParams) {
      this.name = name;
      this.email = email;
      this.phone = phone;
      this.address = address;
   }

}
