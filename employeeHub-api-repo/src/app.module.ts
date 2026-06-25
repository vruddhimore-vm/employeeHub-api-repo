import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';

@Module({
   imports: [
 TypeOrmModule.forRoot({
  type: 'mssql',
  host: 'localhost',
  username: 'employeehubuser',
  password: 'emphub123!',
  database: 'Employeehub',
  entities: [User],
  synchronize: false,
  
  options: {
    instanceName: 'SQLEXPRESS',
    encrypt: false,
    trustServerCertificate: true,
  },
}),
 UserModule,
 AuthModule
  ],
})
export class AppModule {}
