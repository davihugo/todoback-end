import { Module } from '@nestjs/common';
import { TarefasService } from './tarefas.service';
import { TarefasController } from './tarefas.controller';
import { DatabaseConfig } from 'src/sqlConfig';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { ListaService } from 'src/lista/lista.service';
import { TopicosService } from 'src/topicos/topicos.service';

@Module({
  controllers: [TarefasController],
  providers: [TarefasService, DatabaseConfig, UsuariosService, ListaService, TopicosService]
})
export class TarefasModule {}
