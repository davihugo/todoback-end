import { IsNotEmpty, IsNumber, IsPositive, IsString,  } from "class-validator";
import { Lista } from "../entities/lista.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateListaDto implements Lista {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    idUsuario: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    idTopico: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    Nome: string;
}
