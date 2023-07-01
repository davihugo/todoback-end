import { Inject, Injectable } from '@nestjs/common';
import { CreateTopicoDto } from './dto/create-topico.dto';
import { UpdateTopicoDto } from './dto/update-topico.dto';
import { DatabaseConfig } from 'src/sqlConfig';
import { UsuariosService } from 'src/usuarios/usuarios.service';
var mysql = require('mysql2');

@Injectable()
export class TopicosService {
  constructor(
    @Inject(UsuariosService) private readonly usuarioService: UsuariosService,
    @Inject(DatabaseConfig) private readonly databaseConfig: DatabaseConfig,
    
  ) {}

  async create(createTopicoDto: CreateTopicoDto) {
    const connection = mysql.createConnection(this.databaseConfig.getConfig());

    try {
      const Usuario = await this.usuarioService.findOne(createTopicoDto.idUsuario);
      if (Usuario.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Usuário não encontrado, impossível finalizar o cadastro do tópico.',
        };
      }

      const query = 'INSERT INTO Topico (Nome, idUsuario) VALUES (?, ?)';
      
      await new Promise((resolve, reject) => {
        connection.query(
          query,
          [createTopicoDto.Nome, createTopicoDto.idUsuario],

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
        message: 'Topico cadastrado com sucesso!',
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async findAll(idUsuario: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const query = 'SELECT * FROM Topico WHERE idUsuario = ?';
      let [rows, fields] = await connection.promise().query(query, [idUsuario]);
   
      if (rows.length === 0) {
        return {
          statusCode: 404,
          message: 'Topicos não encontrados!',
          data: []
        };
      }
      const dadosTopico = rows.map((row) => {
        return {
          idTopico: row.idTopico,
          Nome: row.Nome,
        }
      });

      return {
        statusCode: 200,
        message: 'Topicos encontrados!',
        data: dadosTopico,
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async findOne(idTopico: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const query = 'SELECT * FROM Topico WHERE idTopico = ?';
      let [rows, fields] = await connection.promise().query(query, [idTopico]);
      if (rows.length === 0) {
        return {
          statusCode: 404,
          message: 'Topico não encontrado!',
        };
      }
      const dadosTopico = {
        Nome: rows[0].Nome,
        idUsuario: rows[0].idUsuario,
      };

      return {
        statusCode: 200,
        message: 'Topico encontrado!',
        data: dadosTopico,
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async update(idTopico: number,  updateTopicoDto: UpdateTopicoDto) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    let dadosTopico = {
      Nome: updateTopicoDto.Nome,
      idUsuario: updateTopicoDto.idUsuario,
    };
    try {
      const query = 'UPDATE Topico SET Nome = ? WHERE idTopico = ? AND idUsuario = ?';
      const Topico = await this.findOne(idTopico);
      if (Topico.statusCode === 404) {
        return {
          statusCode: 404,
          message: 'Topico não encontrado!',
        };
      }
      const alteracao = await connection.promise().query(query, [dadosTopico.Nome, idTopico, dadosTopico.idUsuario]);
      if (alteracao[0].affectedRows === 0) {
        return {
          statusCode: 404,
          message: 'Topico não encontrado!',
        };
      }
      return {
        statusCode: 200,
        message: 'Topico alterado com sucesso!',
      };
     
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async remove(idTopico: number, idUsuario: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const query = 'DELETE FROM Topico WHERE idTopico = ? AND idUsuario = ?';
      const Topico = await this.findOne(idTopico);

      if (Topico.statusCode === 404) {
        return {
          statusCode: 404,
          message: 'Topico não encontrado!',
        };
      }
      const delecao = await connection.promise().query(query, [ idTopico, idUsuario]);
      if (delecao[0].affectedRows === 0) {
        return {
          statusCode: 404,
          message: 'Topico não encontrado!',
        };
      }

      return {
        statusCode: 200,
        message: 'Topico removido com sucesso!',
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }
}