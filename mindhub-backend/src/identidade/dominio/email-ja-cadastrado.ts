/** UC01: o email informado já pertence a outro usuário. */
export class EmailJaCadastrado extends Error {
  constructor() {
    super('Já existe um usuário com este email.');
    this.name = 'EmailJaCadastrado';
  }
}
