import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { encodePassword, comparePassword } from 'src/utils/bcrypt';
import { DatabaseConfig } from 'src/sqlConfig';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
var mysql = require('mysql2');

@Injectable()
export class UsuariosService {
  constructor(private readonly databaseConfig: DatabaseConfig) {}

  async cadastro(createUsuarioDto: CreateUsuarioDto) {
    const connection = mysql.createConnection(this.databaseConfig.getConfig());

    const dadosUsuario = {
      Nome: createUsuarioDto.Nome,
      Email: createUsuarioDto.Email,
      Senha: await encodePassword(createUsuarioDto.Senha),
    };
   
    try {
      const query = 'INSERT INTO Usuarios (Nome, Email, Senha) VALUES (?, ?, ?)';
      await new Promise((resolve, reject) => {
        connection.query(
          query,
          [dadosUsuario.Nome, dadosUsuario.Email, dadosUsuario.Senha],

          function (error, results, fields) {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          },
        );
      });
      return {
        statusCode: 201,
        message: 'Usuário cadastrado com sucesso!',
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return {
          statusCode: 409,
          message: 'Usuário já cadastrado!',
        };
      }
      throw error;
    } finally {
      connection.end();
    }
  }

  async login(loginUsuarioDto: LoginUsuarioDto) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    let dadosUsuario = {
      Email: loginUsuarioDto.Email,
      Senha: loginUsuarioDto.Senha,
    };

    try {
      const query = 'SELECT * FROM Usuarios WHERE Email = ? AND Ativo = 1';
      let [rows, fields] = await connection.promise().query(query, [dadosUsuario.Email ]);

      if (rows.length === 0) {
        return {
          statusCode: 404,
          message: 'Usuário não encontrado!',
        };
      }
      let usuario = rows[0];
      let senhaValida = await comparePassword(
        dadosUsuario.Senha,
        usuario.Senha,
      );
      if (!senhaValida) {
        return {
          statusCode: 401,
          message: 'Senha inválida!',
        };
      }
      return {
        statusCode: 200,
        message: 'Login efetuado com sucesso!',
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async findOne(idUsuario: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const query = 'SELECT * FROM Usuarios WHERE idUsuario = ? AND Ativo = 1';
      let [rows, fields] = await connection.promise().query(query, [idUsuario]);
      if (rows.length === 0) {
        return {
          statusCode: 404,
          message: 'Usuário não encontrado!',
        };
      }
      const dadosUsuario = {
        Nome: rows[0].Nome,
        Email: rows[0].Email,
        Ativo: rows[0].Ativo[0] === 1 ? true : false,
      };

      return {
        statusCode: 200,
        message: 'Usuário encontrado!',
        data: dadosUsuario,
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async update(idUsuario: number, updateUsuarioDto: UpdateUsuarioDto) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    let dadosUsuario = {
      Nome: updateUsuarioDto.Nome,
    };
    try {
      const query = 'UPDATE Usuarios SET Nome = ? WHERE idUsuario = ?';
      const Usuario = await this.findOne(idUsuario);
      if (Usuario.statusCode === 404) {
        return {
          statusCode: 404,
          message: 'Usuário não encontrado!',
        };
      }
      await connection.promise().query(query, [dadosUsuario.Nome, idUsuario]);

      return {
        statusCode: 200,
        message: 'Usuário atualizado com sucesso!',
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async remove(idUsuario: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const query = 'UPDATE Usuarios SET Ativo = 0 WHERE idUsuario = ?';
      const Usuario = await this.findOne(idUsuario);
      if (Usuario.statusCode === 404) {
        return {
          statusCode: 404,
          message: 'Usuário não encontrado!',
        };
      }
      await connection.promise().query(query, [idUsuario]);

      return {
        statusCode: 200,
        message: 'Usuário removido com sucesso!',
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }
}
