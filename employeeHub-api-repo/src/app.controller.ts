import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
constructor(private dataSource: DataSource) {}
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

    @Get('db-test')
  async testDb() {
    return {
      isConnected: this.dataSource.isInitialized,
      message: 'Database connection check',
    };
  }

}
