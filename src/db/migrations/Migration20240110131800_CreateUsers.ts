import { Migration } from '@mikro-orm/migrations';

export class Migration20240110131800_CreateUsers extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "address" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }
}
