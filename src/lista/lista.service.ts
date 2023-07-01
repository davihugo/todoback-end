import { Inject, Injectable } from '@nestjs/common';
import { CreateListaDto } from './dto/create-lista.dto';
import { UpdateListaDto } from './dto/update-lista.dto';
import { DatabaseConfig } from 'src/sqlConfig';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { TopicosService } from 'src/topicos/topicos.service';
var mysql = require('mysql2');

@Injectable()
export class ListaService {
  constructor(
    @Inject(UsuariosService) private readonly usuarioService: UsuariosService,
    @Inject(DatabaseConfig) private readonly databaseConfig: DatabaseConfig,
    @Inject(TopicosService) private readonly topicosService: TopicosService,
    ) {}

  async validations(idUsuario: number, idTopico: number) {
    const DadosUsuario = idUsuario === null ? { statusCode: 200 } : await this.usuarioService.findOne(idUsuario);
    const DadosTopico = await this.topicosService.findOne(idTopico);

    return {
      validationUsuario: {
        statusCode: DadosUsuario.statusCode,
      },
      validationTopico: {
        statusCode: DadosTopico.statusCode,
        idUsuario: DadosTopico.statusCode === 200 ? parseInt(DadosTopico.data.idUsuario) : null,
      },
    }
  }
  
  async create(createListaDto: CreateListaDto) {
    const connection = mysql.createConnection(this.databaseConfig.getConfig());

    try {
      const { validationTopico, validationUsuario } = await this.validations(createListaDto.idUsuario, createListaDto.idTopico);
      console.log(validationTopico.statusCode)
      if (validationUsuario.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Usuário não encontrado, impossível finalizar o cadastro da lista.',
        };
      }
      
      if (validationTopico.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Tópico não encontrado, impossível finalizar o cadastro da lista.',
        };
      }

      if (validationTopico.idUsuario !== createListaDto.idUsuario) {
        return {
          statusCode: 404,
          message: 'Tópico não pertence ao usuário, impossível finalizar o cadastro da lista.',
        };
      }

      const query = 'INSERT INTO Listas (Nome, idTopico) VALUES (?, ?)';
      
      await new Promise((resolve, reject) => {
        connection.query(
          query,
          [createListaDto.Nome, createListaDto.idTopico],

          function (error, results) {
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
        message: 'Lista cadastrada com sucesso!',
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async findAll(idTopico: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const { validationTopico } = await this.validations(null, idTopico);

      if (validationTopico.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Tópico não encontrado, impossível listar as listas.',
        };
      }

      const query = ` SELECT
                        T.Nome AS NomeTopico,
                        L.idLista,
                        L.Nome
                      FROM
                        Listas AS L
                      LEFT JOIN Topico AS T ON (L.idTopico=T.idTopico)
                      WHERE
                        L.idTopico = ?
      `;

      let [rows] = await connection.promise().query(query, [idTopico]);
   
      if (rows.length === 0) {
        return {
          statusCode: 404,
          message: 'Nenhuma lista encontrada!',
          data: []
        };
      }
      const dadosTopico = rows.map((row) => {
        return {
          Topico: row.NomeTopico,
          idLista: row.idLista,
          Nome: row.Nome,
        }
      });

      return {
        statusCode: 200,
        message: 'Listas encontradas com sucesso!',
        data: dadosTopico,
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async findAllTarefas(idLista: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      

      const query = ` SELECT
                        idTarefa,
                        Nome,
                        Completa
                      FROM
                        Tarefas
                      WHERE
                        idLista = ?
      `;

      let [rows] = await connection.promise().query(query, [idLista]);
   
      if (rows.length === 0) {
        return {
          statusCode: 404,
          message: 'Nenhuma tarera encontrada!',
          data: []
        };
      }
      const dadosTarefa = rows.map((row) => {
        return {
          idTarefa: row.idTarefa,
          Nome: row.Nome,
          Completa: row.Completa === 1 ? true : false,
        }
      });

      return {
        statusCode: 200,
        message: 'Tarefas encontradas com sucesso!',
        data: dadosTarefa,
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async findOne(idLista: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const query = `SELECT
                      T.idTopico,
                      T.idUsuario,
                      L.idLista,
                      L.Nome
                    FROM
                      Listas AS L
                    LEFT JOIN Topico AS T ON (L.idTopico=T.idTopico)
                    WHERE
                      L.idLista = ?
      `;

      let [rows] = await connection.promise().query(query, [idLista]);
   
      if (rows.length === 0) {
        return {
          statusCode: 404,
          message: 'Nenhuma lista encontrada!',
          data: []
        };
      }
      const dadosTopico = rows.map((row) => {
        return {
          idTopico: row.idTopico,
          idUsuario: row.idUsuario,
          idLista: row.idLista,
          Nome: row.Nome,
        }
      });

      return {
        statusCode: 200,
        message: 'Listas encontradas com sucesso!',
        data: dadosTopico,
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async update(idLista: number,  updateListaDto: UpdateListaDto) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    
    try {
      const { validationTopico, validationUsuario } = await this.validations(updateListaDto.idUsuario, updateListaDto.idTopico);

      if (validationUsuario.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Usuário não encontrado, impossível finalizar alteracao da lista.',
        };
      }

      if (validationTopico.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Tópico não encontrado, impossível finalizar alteracao da lista.',
        };
      }

      if (validationTopico.idUsuario !== updateListaDto.idUsuario) {
        return {
          statusCode: 404,
          message: 'Tópico não pertence ao usuário, impossível finalizar alteracao da lista.',
        };
      }

      const query = 'UPDATE Listas SET Nome = ? WHERE idLista = ? AND idTopico = ?';
      
      const Lista = await this.findOne(idLista);
      if (Lista.statusCode === 404) {
        return {
          statusCode: 404,
          message: 'Lista não encontrada!',
        };
      }
      const alteracao = await connection.promise().query(query, [updateListaDto.Nome, idLista, updateListaDto.idTopico]);
      if (alteracao[0].affectedRows === 0) {
        return {
          statusCode: 404,
          message: 'Lista não encontrada!',
        };
      }
      return {
        statusCode: 200,
        message: 'Lista alterada com sucesso!',
      };
     
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async remove(idLista: number, idUsuario: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const query = `DELETE FROM Listas WHERE idLista = ?`;

      const Lista = await this.findOne(idLista);

      if (Lista.statusCode === 404) {
        return {
          statusCode: 404,
          message: 'Lista não encontrada!',
        };
      }

      const { validationTopico } = await this.validations(null, Lista.data[0].idTopico);
      if (validationTopico.idUsuario != idUsuario) {
        return {
          statusCode: 404,
          message: 'Tópico não pertence ao usuário, impossível finalizar exclusão da lista.',
        };
      }

      const delecao = await connection.promise().query(query, [idLista]);
      if (delecao[0].affectedRows === 0) {
        return {
          statusCode: 404,
          message: 'Lista não encontrada!',
        };
      }

      return {
        statusCode: 200,
        message: 'Lista deletada com sucesso!',
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }
}
