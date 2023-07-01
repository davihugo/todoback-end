import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ListaService } from './lista.service';
import { CreateListaDto } from './dto/create-lista.dto';
import { UpdateListaDto } from './dto/update-lista.dto';

@Controller('lista')
export class ListaController {
  constructor(private readonly listaService: ListaService) {}

  @Post()
  create(@Body() createListaDto: CreateListaDto) {
    return this.listaService.create(createListaDto);
  }

  @Get('topico/:idTopico')
  findAll(@Param('idTopico') idTopico: number) {
    return this.listaService.findAll(idTopico);
  }

  @Get('tarefas/:idLista')
  findAllTarefas(@Param('idLista') idLista: number) {
    return this.listaService.findAllTarefas(idLista);
  }

  @Get(':idLista')
  findOne(@Param('idLista') idLista: number) {
    return this.listaService.findOne(idLista);
  }

  @Patch(':idLista')
  update(@Param('idLista') idLista: number, @Body() updateListaDto: UpdateListaDto) {
    return this.listaService.update(idLista, updateListaDto);
  }

  @Delete()
  remove(@Query('idLista') idLista: number, @Query('idUsuario') idUsuario: number) {
    return this.listaService.remove(idLista, idUsuario);
  }
}
