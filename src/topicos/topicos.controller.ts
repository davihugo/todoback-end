import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TopicosService } from './topicos.service';
import { CreateTopicoDto } from './dto/create-topico.dto';
import { UpdateTopicoDto } from './dto/update-topico.dto';

@Controller('topicos')
export class TopicosController {
  constructor(private readonly topicosService: TopicosService) {}

  @Post()
  create(@Body() createTopicoDto: CreateTopicoDto) {
    return this.topicosService.create(createTopicoDto);
  }

  @Get('lista/usuario/:idUsuario')
  findAll(@Param('idUsuario') idUsuario: number) {
    return this.topicosService.findAll(idUsuario);
  }

  @Patch('editar/:idTopico')
  update(@Param('idTopico') idTopico: number, @Body() updateTopicoDto: UpdateTopicoDto) {
    return this.topicosService.update(idTopico, updateTopicoDto);
  }

  @Delete()
  remove(@Query('idTopico') idTopico: number, @Query('idUsuario') idUsuario: number) {
    return this.topicosService.remove(idTopico, idUsuario);
  }
}
