import { Module } from '@nestjs/common';
import { ListaService } from './lista.service';
import { ListaController } from './lista.controller';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { DatabaseConfig } from 'src/sqlConfig';
import { TopicosService } from 'src/topicos/topicos.service';

@Module({
  controllers: [ListaController],
  providers: [ListaService, UsuariosService, DatabaseConfig, TopicosService]
})
export class ListaModule {}
