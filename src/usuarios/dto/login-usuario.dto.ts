import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginUsuarioDto extends PartialType(CreateUsuarioDto) {
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