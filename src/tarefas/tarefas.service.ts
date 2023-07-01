import { Inject, Injectable } from '@nestjs/common';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { DatabaseConfig } from 'src/sqlConfig';
import { ListaService } from 'src/lista/lista.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
var mysql = require('mysql2');

@Injectable()
export class TarefasService {
  constructor(
    @Inject(UsuariosService) private readonly usuarioService: UsuariosService,
    @Inject(DatabaseConfig) private readonly databaseConfig: DatabaseConfig,
    @Inject(ListaService) private readonly ListaService: ListaService,
  ) {}

  async validations(idUsuario: number, idLista: number) {
    const DadosUsuario =
      idUsuario === null
        ? { statusCode: 200 }
        : await this.usuarioService.findOne(idUsuario);
    const DadosLista = await this.ListaService.findOne(idLista);

    return {
      validationUsuario: {
        statusCode: DadosUsuario.statusCode,
      },
      validationLista: {
        statusCode: DadosLista.statusCode,
        idLista: DadosLista.statusCode === 200 ? DadosLista.data[0].idLista : null,
        idUsuario:
          DadosLista.statusCode === 200
            ? parseInt(DadosLista.data[0].idUsuario)
            : null,
      },
    };
  }

  async create(createTarefaDto: CreateTarefaDto) {
    const connection = mysql.createConnection(this.databaseConfig.getConfig());

    try {
      const { validationUsuario, validationLista } = await this.validations(
        createTarefaDto.idUsuario,
        createTarefaDto.idLista,
      );
      if (validationUsuario.statusCode !== 200) {
        return {
          statusCode: 404,
          message:
            'Usuário não encontrado, impossível finalizar o cadastro da tarefa.',
        };
      }

      if (validationLista.statusCode !== 200) {
        return {
          statusCode: 404,
          message:
            'Lista não encontrada, impossível finalizar o cadastro da tarefa.',
        };
      }

      if (validationLista.idUsuario !== createTarefaDto.idUsuario) {
        return {
          statusCode: 404,
          message:
            'Lista não pertence ao usuário, impossível finalizar o cadastro da tarefa.',
        };
      }

      const query = 'INSERT INTO Tarefas (Nome, idLista) VALUES (?, ?)';

      await new Promise((resolve, reject) => {
        connection.query(
          query,
          [createTarefaDto.Nome, createTarefaDto.idLista],

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
        message: 'Tarefa cadastrada com sucesso!',
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async findAll(idLista: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const { validationLista } = await this.validations(null, idLista);

      if (validationLista.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Lista não encontrada, impossível localizar as tarefas.',
        };
      }

      const query = ` SELECT
                        L.Nome AS NomeLista,
                        T.idTarefa,
                        T.Nome,
                        T.Completa
                      FROM
                        Tarefas AS T
                      LEFT JOIN Listas AS L ON (T.idLista=L.idLista)
                      WHERE
                        T.idLista = ?
      `;

      let [rows] = await connection.promise().query(query, [idLista]);

      if (rows.length === 0) {
        return {
          statusCode: 404,
          message: 'Nenhuma tarefa encontrada!',
          data: [],
        };
      }
      const dadosTopico = rows.map((row) => {
        return {
          Lista: row.NomeLista,
          idTarefa: row.idTarefa,
          Nome: row.Nome,
          Completa: row.Completa.toString() === '1' ? true : false,
        };
      });

      return {
        statusCode: 200,
        message: 'Tarefas encontradas com sucesso!',
        data: dadosTopico,
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async findOne(idTarefa: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const query = `SELECT
                        T.idTarefa,
                        T.Nome,
                        T.Completa,
                        L.idLista,
                        TP.idUsuario
                      FROM
                        Tarefas AS T
                        INNER JOIN Listas AS L ON (T.idLista = L.idLista)
                        INNER JOIN Topico AS TP ON (L.idTopico = TP.idTopico)
                      WHERE
                        T.idTarefa = ?
      `;

      let [rows] = await connection.promise().query(query, [idTarefa]);

      if (rows.length === 0) {
        return {
          statusCode: 404,
          message: 'Nenhuma tarefa encontrada!',
          data: [],
        };
      }
      const dadosTopico = rows.map((row) => {
        return {
          idUsuario: row.idUsuario,
          idLista: row.idLista,
          idTarefa: row.idTarefa,
          Nome: row.Nome,
          Completa: row.Completa.toString() === '1' ? true : false,
        };
      });

      return {
        statusCode: 200,
        message: 'Tarefas encontradas com sucesso!',
        data: dadosTopico,
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async update(idTarefa: number, completa: boolean) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    

    const Data = {
      completa: completa == true ? 1 : 0,
      idTarefa: idTarefa,
    };

    try {
      const dadosTarefa = await this.findOne(idTarefa);

      if (dadosTarefa.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Tarefa não encontrada!',
          data: [],
        };
      }

      const query = 'UPDATE Tarefas SET Completa = ? WHERE idTarefa = ?';

      let [rows] = await connection
        .promise()
        .query(query, [Data.completa, Data.idTarefa]);

      if (rows.length === 0) {
        return {
          statusCode: 404,
          message: 'Nenhuma tarefa encontrada!',
          data: [],
        };
      }

      return {
        statusCode: 200,
        message: 'Tarefa atualizada com sucesso!',
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }

  async remove(idTarefa: number, idUsuario: number) {
    let connection = await mysql.createConnection(
      this.databaseConfig.getConfig(),
    );
    try {
      const query = `DELETE FROM Tarefas WHERE idTarefa = ?`;

      const Tarefa = await this.findOne(idTarefa);

      if (Tarefa.statusCode === 404) {
        return {
          statusCode: 404,
          message: 'Tarefa não encontrada!',
        };
      }

      const { validationLista } = await this.validations(null, Tarefa.data[0].idLista);
      if (validationLista.idUsuario != idUsuario) {
        return {
          statusCode: 404,
          message: 'Lista não pertence ao usuário, impossível remover a tarefa.',
        };
      }

      if (validationLista.idLista != Tarefa.data[0].idLista) {
        return {
          statusCode: 404,
          message: 'Lista não encontrada!',
        };
      }

      const delecao = await connection.promise().query(query, [idTarefa]);
      if (delecao[0].affectedRows === 0) {
        return {
          statusCode: 404,
          message: 'Nenhuma tarefa encontrada!',
        };
      }

      return {
        statusCode: 200,
        message: 'Tarefa removida com sucesso!',
      };
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }
}
