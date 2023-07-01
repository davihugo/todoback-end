import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { DatabaseConfig } from 'src/sqlConfig';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, DatabaseConfig],

})
export class UsuariosModule {}
