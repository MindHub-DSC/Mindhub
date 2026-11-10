import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { ReconhecerUsuario } from '../../src/identidade/aplicacao/reconhecer-usuario.js';
import { EmailJaCadastrado } from '../../src/identidade/dominio/email-ja-cadastrado.js';
import { Usuario } from '../../src/identidade/dominio/usuario.js';
import { UsuarioOrmEntity } from '../../src/identidade/infra/usuario.orm-entity.js';
import { UsuariosTypeOrmRepositorio } from '../../src/identidade/infra/usuarios.typeorm-repositorio.js';
import { lerAmbienteDoBanco } from '../../src/config/ambiente.js';
import { opcoesTypeOrm } from '../../src/database/opcoes-typeorm.js';
import { limparDadosDosUsuarios } from '../support/limpeza.js';

/** C1 persistido: a porta pública de reconhecimento lê o PostgreSQL real. */
describe('Usuários (C1) — TypeORM/PostgreSQL', () => {
  let banco: DataSource;
  let repositorio: UsuariosTypeOrmRepositorio;
  const usuariosDoTeste: string[] = [];

  beforeAll(async () => {
    banco = new DataSource(opcoesTypeOrm(lerAmbienteDoBanco()));
    await banco.initialize();
    repositorio = new UsuariosTypeOrmRepositorio(
      banco.getRepository(UsuarioOrmEntity),
    );
  });

  afterEach(async () => {
    await limparDadosDosUsuarios(banco, usuariosDoTeste.splice(0));
  });

  afterAll(async () => {
    await banco.destroy();
  });

  function novoUsuario(email = `int-${randomUUID()}@exemplo.test`) {
    const usuario = Usuario.cadastrar({ nome: 'Ana', email });
    usuariosDoTeste.push(usuario.id);
    return usuario;
  }

  it('ReconhecerUsuario lê o banco: true para cadastrado, false para inexistente', async () => {
    const usuario = novoUsuario();
    await repositorio.adicionar(usuario);
    const reconhecimento = new ReconhecerUsuario(repositorio);

    expect(await reconhecimento.reconhecer(usuario.id)).toBe(true);
    expect(await reconhecimento.reconhecer(randomUUID())).toBe(false);
  });

  it('email repetido vira EmailJaCadastrado pela restrição única', async () => {
    const email = `int-${randomUUID()}@exemplo.test`;
    await repositorio.adicionar(novoUsuario(email));

    await expect(
      repositorio.adicionar(novoUsuario(email)),
    ).rejects.toBeInstanceOf(EmailJaCadastrado);
  });
});
