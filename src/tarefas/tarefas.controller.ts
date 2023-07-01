import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TarefasService } from './tarefas.service';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';

@Controller('tarefas')
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Post()
  create(@Body() createTarefaDto: CreateTarefaDto) {
    return this.tarefasService.create(createTarefaDto);
  }

  @Get('lista/:idLista')
  findAll(@Param('idLista') idLista: number) {
    return this.tarefasService.findAll(idLista);
  }


  @Patch('completa')
  update(@Query('idTarefa') idTarefa: number, @Query('completa') completa: boolean) {
    return this.tarefasService.update(idTarefa, completa);
  }

  @Delete()
  remove(@Query('idTarefa') idTarefa: number, @Query('idUsuario') idUsuario: number) {
    return this.tarefasService.remove(idTarefa, idUsuario);
  }
}
