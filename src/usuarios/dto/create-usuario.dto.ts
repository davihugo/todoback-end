import { ApiProperty } from "@nestjs/swagger";
import { Usuario } from "../entities/usuario.entity";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUsuarioDto implements Usuario {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    Nome: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    Email: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    Senha: string;
}
