import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import type { Usuario } from '../src/usuarios/usuario.dto.js';
import type { Especialista } from '../src/especialistas/especialista.dto.js';
import type { Servico } from '../src/servicos/servico.dto.js';
import type { Solicitacao } from '../src/solicitacoes/solicitacao.dto.js';

const perfilDados = {
  descricao: 'Mentor de desenvolvimento de software',
  especialidades: ['NestJS'],
};
const servicoDados = {
  titulo: 'Mentoria de backend',
  descricao: 'Orientação para criar uma API',
  tipo: 'MENTORIA',
};
const condicoesComerciais = {
  preco: { valorCentavos: 15000, moeda: 'BRL' },
  quantidadeSessoes: 1,
  duracaoMinutos: 60,
};

describe('Mindhub (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  async function usuario(email = 'cliente@example.com'): Promise<Usuario> {
    const response = await request(app.getHttpServer())
      .post('/api/usuarios')
      .send({ nome: 'Cliente de teste', email })
      .expect(201);
    return response.body as Usuario;
  }

  async function especialista(usuarioId: string): Promise<Especialista> {
    const response = await request(app.getHttpServer())
      .post('/api/especialistas')
      .send({ usuarioId, ...perfilDados })
      .expect(201);
    return response.body as Especialista;
  }

  async function contexto() {
    const cliente = await usuario();
    const profissional = await usuario('mentor@example.com');
    const perfil = await especialista(profissional.id);
    return { cliente, profissional, perfil };
  }

  it('identifica a aplicação e informa sua saúde', async () => {
    const info = await request(app.getHttpServer()).get('/').expect(200);
    expect(info.body).toMatchObject({
      nome: 'Mindhub',
      descricao: 'Plataforma de Mentorias e Consultorias',
    });
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', aplicacao: 'Mindhub' });
  });

  it('cadastra usuário, normaliza contato e consulta o mesmo registro', async () => {
    const criado = await usuario('  CLIENTE@example.com  ');
    expect(criado.email).toBe('cliente@example.com');
    await request(app.getHttpServer())
      .get('/api/usuarios/' + criado.id)
      .expect(200)
      .expect(criado);
    const lista = await request(app.getHttpServer())
      .get('/api/usuarios')
      .expect(200);
    expect(lista.body).toEqual([criado]);
    await usuario('outro@example.com');
    await request(app.getHttpServer())
      .post('/api/usuarios')
      .send({ nome: 'Outro', email: 'CLIENTE@example.com' })
      .expect(409);
  });

  it('mantém cliente e especialista como papéis do mesmo usuário', async () => {
    const { cliente, perfil } = await contexto();
    const perfilCliente = await especialista(cliente.id);
    expect(perfilCliente.usuarioId).toBe(cliente.id);
    const usuarios = await request(app.getHttpServer())
      .get('/api/usuarios')
      .expect(200);
    expect(usuarios.body).toHaveLength(2);
    await request(app.getHttpServer())
      .post('/api/solicitacoes')
      .send({
        clienteId: cliente.id,
        especialistaId: perfil.id,
        objetivo: 'Aprender NestJS',
        escopo: 'API básica',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/especialistas')
      .send({ usuarioId: cliente.id, ...perfilDados })
      .expect(409);
  });

  it('publica os dois modelos de serviço e filtra o catálogo', async () => {
    const { perfil } = await contexto();
    const direta = await request(app.getHttpServer())
      .post('/api/servicos')
      .send({
        ...servicoDados,
        especialistaId: perfil.id,
        modeloContratacao: 'RESERVA_DIRETA',
        condicoesComerciais,
      })
      .expect(201);
    const proposta = await request(app.getHttpServer())
      .post('/api/servicos')
      .send({
        ...servicoDados,
        especialistaId: perfil.id,
        modeloContratacao: 'SOB_PROPOSTA',
      })
      .expect(201);
    expect((direta.body as Servico).modeloContratacao).toBe('RESERVA_DIRETA');
    await request(app.getHttpServer())
      .get('/api/servicos/' + (direta.body as Servico).id)
      .expect(200)
      .expect(direta.body);
    const todos = await request(app.getHttpServer())
      .get('/api/servicos')
      .expect(200);
    expect(todos.body).toHaveLength(2);
    const filtrados = await request(app.getHttpServer())
      .get('/api/servicos')
      .query({ especialistaId: perfil.id, modeloContratacao: 'SOB_PROPOSTA' })
      .expect(200);
    expect(filtrados.body).toEqual([proposta.body]);
    const vazio = await request(app.getHttpServer())
      .get('/api/servicos')
      .query({ especialistaId: randomUUID() })
      .expect(200);
    expect(vazio.body).toEqual([]);
  });

  it('registra uma necessidade direcionada a um especialista e a serviço Sob Proposta', async () => {
    const { cliente, perfil } = await contexto();
    const response = await request(app.getHttpServer())
      .post('/api/servicos')
      .send({
        ...servicoDados,
        especialistaId: perfil.id,
        modeloContratacao: 'SOB_PROPOSTA',
      })
      .expect(201);
    const servico = response.body as Servico;
    const dados = {
      clienteId: cliente.id,
      especialistaId: perfil.id,
      servicoId: servico.id,
      objetivo: 'Preparar uma API',
      escopo: 'Catálogo de mentorias',
    };
    const criada = await request(app.getHttpServer())
      .post('/api/solicitacoes')
      .send(dados)
      .expect(201);
    expect(criada.body).toMatchObject(dados);
    await request(app.getHttpServer())
      .get('/api/solicitacoes/' + (criada.body as Solicitacao).id)
      .expect(200)
      .expect(criada.body);
    const filtro = await request(app.getHttpServer())
      .get('/api/solicitacoes')
      .query({ clienteId: cliente.id, especialistaId: perfil.id })
      .expect(200);
    expect(filtro.body).toEqual([criada.body]);
    const vazio = await request(app.getHttpServer())
      .get('/api/solicitacoes')
      .query({ clienteId: randomUUID() })
      .expect(200);
    expect(vazio.body).toEqual([]);
  });

  it('bloqueia publicação e novas solicitações para especialista suspenso (RN01)', async () => {
    const { cliente, perfil } = await contexto();
    await request(app.getHttpServer())
      .patch('/api/especialistas/' + perfil.id + '/situacao')
      .send({ situacao: 'SUSPENSO' })
      .expect(200);
    await request(app.getHttpServer())
      .post('/api/servicos')
      .send({
        ...servicoDados,
        especialistaId: perfil.id,
        modeloContratacao: 'SOB_PROPOSTA',
      })
      .expect(409);
    await request(app.getHttpServer())
      .post('/api/solicitacoes')
      .send({
        clienteId: cliente.id,
        especialistaId: perfil.id,
        objetivo: 'Aprender',
        escopo: 'Backend',
      })
      .expect(409);
    const situacao = await request(app.getHttpServer())
      .get('/api/especialistas/' + perfil.id)
      .expect(200);
    expect(situacao.body).toMatchObject({
      id: perfil.id,
      situacao: 'SUSPENSO',
    });
    await request(app.getHttpServer())
      .patch('/api/especialistas/' + perfil.id + '/situacao')
      .send({ situacao: 'ATIVO' })
      .expect(200);
    await request(app.getHttpServer())
      .post('/api/servicos')
      .send({
        ...servicoDados,
        especialistaId: perfil.id,
        modeloContratacao: 'SOB_PROPOSTA',
      })
      .expect(201);
  });

  it('rejeita serviço de outro especialista e Reserva Direta na negociação', async () => {
    const { cliente, perfil } = await contexto();
    const outro = await especialista((await usuario('outro@example.com')).id);
    const proposta = await request(app.getHttpServer())
      .post('/api/servicos')
      .send({
        ...servicoDados,
        especialistaId: outro.id,
        modeloContratacao: 'SOB_PROPOSTA',
      })
      .expect(201);
    const direta = await request(app.getHttpServer())
      .post('/api/servicos')
      .send({
        ...servicoDados,
        especialistaId: perfil.id,
        modeloContratacao: 'RESERVA_DIRETA',
        condicoesComerciais,
      })
      .expect(201);
    const dados = {
      clienteId: cliente.id,
      especialistaId: perfil.id,
      objetivo: 'Aprender',
      escopo: 'Backend',
    };
    await request(app.getHttpServer())
      .post('/api/solicitacoes')
      .send({ ...dados, servicoId: (proposta.body as Servico).id })
      .expect(409);
    await request(app.getHttpServer())
      .post('/api/solicitacoes')
      .send({ ...dados, servicoId: (direta.body as Servico).id })
      .expect(409);
  });

  it('rejeita referências a usuários, especialistas e serviços inexistentes', async () => {
    await request(app.getHttpServer())
      .post('/api/especialistas')
      .send({ usuarioId: randomUUID(), ...perfilDados })
      .expect(404);
    await request(app.getHttpServer())
      .post('/api/servicos')
      .send({
        ...servicoDados,
        especialistaId: randomUUID(),
        modeloContratacao: 'SOB_PROPOSTA',
      })
      .expect(404);
    const { cliente, perfil } = await contexto();
    const dados = {
      clienteId: cliente.id,
      especialistaId: perfil.id,
      objetivo: 'Aprender',
      escopo: 'Backend',
    };
    for (const alteracao of [
      { clienteId: randomUUID() },
      { especialistaId: randomUUID() },
      { servicoId: randomUUID() },
    ]) {
      await request(app.getHttpServer())
        .post('/api/solicitacoes')
        .send({ ...dados, ...alteracao })
        .expect(404);
    }
  });

  it('valida email, textos obrigatórios, campos desconhecidos e dinheiro em centavos', async () => {
    for (const dados of [
      { nome: ' ', email: 'cliente@example.com' },
      { nome: 'Cliente', email: 'invalido' },
      { nome: 'Cliente', email: 'cliente@example.com', papel: 'ADMINISTRADOR' },
    ]) {
      await request(app.getHttpServer())
        .post('/api/usuarios')
        .send(dados)
        .expect(400);
    }
    const { cliente, perfil } = await contexto();
    const direta = {
      ...servicoDados,
      especialistaId: perfil.id,
      modeloContratacao: 'RESERVA_DIRETA',
    };
    await request(app.getHttpServer())
      .post('/api/servicos')
      .send(direta)
      .expect(400);
    for (const valorCentavos of [-1, 12.5, '15000']) {
      await request(app.getHttpServer())
        .post('/api/servicos')
        .send({
          ...direta,
          condicoesComerciais: {
            ...condicoesComerciais,
            preco: { valorCentavos, moeda: 'BRL' },
          },
        })
        .expect(400);
    }
    await request(app.getHttpServer())
      .post('/api/solicitacoes')
      .send({
        clienteId: cliente.id,
        especialistaId: perfil.id,
        objetivo: ' ',
        escopo: 'Backend',
      })
      .expect(400);
    await request(app.getHttpServer())
      .patch('/api/especialistas/' + perfil.id + '/situacao')
      .send({ situacao: 'INVALIDA' })
      .expect(400);
  });

  it.each(['usuarios', 'especialistas', 'servicos', 'solicitacoes'])(
    'retorna erros claros para IDs inválidos ou ausentes em %s',
    async (recurso) => {
      await request(app.getHttpServer())
        .get('/api/' + recurso + '/invalido')
        .expect(400);
      await request(app.getHttpServer())
        .get('/api/' + recurso + '/' + randomUUID())
        .expect(404);
    },
  );

  it('valida também os filtros de pesquisa', async () => {
    await request(app.getHttpServer())
      .get('/api/servicos')
      .query({ modeloContratacao: 'INVALIDO' })
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/solicitacoes')
      .query({ clienteId: 'invalido' })
      .expect(400);
  });
});
