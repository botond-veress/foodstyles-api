import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTodoItem1661674836175 implements MigrationInterface {
  name = 'createTodoItem1661674836175';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`todo_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`title\` varchar(512) NOT NULL, \`completedAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, INDEX \`IDX_0d6cd1d8e403a84a40d459b02d\` (\`completedAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`todo_item\` ADD CONSTRAINT \`FK_de7d5cecfe1881be7ae8a14cc37\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`todo_item\` DROP FOREIGN KEY \`FK_de7d5cecfe1881be7ae8a14cc37\``);
    await queryRunner.query(`DROP INDEX \`IDX_0d6cd1d8e403a84a40d459b02d\` ON \`todo_item\``);
    await queryRunner.query(`DROP TABLE \`todo_item\``);
  }
}
