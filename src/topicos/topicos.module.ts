import { Module } from '@nestjs/common';
import { TopicosService } from './topicos.service';
import { TopicosController } from './topicos.controller';
import { DatabaseConfig } from 'src/sqlConfig';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Module({
  controllers: [TopicosController],
  providers: [TopicosService, DatabaseConfig, UsuariosService]
})
export class TopicosModule {}
