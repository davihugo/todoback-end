import { ApiProperty } from "@nestjs/swagger";
import { Tarefa } from "../entities/tarefa.entity";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateTarefaDto implements Tarefa{
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    idUsuario: number;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    Nome: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    idLista: number;
}
