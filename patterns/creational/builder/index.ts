/**
 * Facilitates the creation of objects with many optional parameters.
 *
 * @date 23/02/2025 - 00:00:00
 *
 */

class Livro {
  private nome!: string;
  private editora!: string;
  private ano!: string;

  public setNome(nome: string): this {
    this.nome = nome;
    return this;
  }

  public setEditora(editora: string): this {
    this.editora = editora;
    return this;
  }

  public setAno(ano: string): this {
    this.ano = ano;
    return this;
  }

  public build(): Livro {
    return this;
  }

  public showDetails(): string {
    return `Livro: ${this.nome}, Editora: ${this.editora}, Ano: ${this.ano}`;
  }
}

(() => {
  const livro = new Livro()
    .setNome("Engenharia Soft Moderna")
    .setEditora("UFMG")
    .setAno("2020")
    .build();

  console.log(livro.showDetails());
})();
