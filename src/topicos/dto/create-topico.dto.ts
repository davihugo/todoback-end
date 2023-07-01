import { ApiProperty } from "@nestjs/swagger";
import { Topico } from "../entities/topico.entity";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTopicoDto implements Topico {
    @ApiProperty()
    @IsString()
    Nome: string;

    @ApiProperty()
    @IsNumber()
    idUsuario: number;
}
