import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER ,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [ __dirname + '/../models/*.js' ],
  synchronize: false, 
  autoLoadEntities: true,
});
