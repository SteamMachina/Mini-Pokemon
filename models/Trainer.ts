import { Pokemon } from "./Pokemon";

export class Trainer {
  private name: string;
  private level: number;
  private xp: number;
  private pokemonList: Pokemon[];

  public constructor(
    name: string = "Sasha",
    level: number = 0,
    xp: number = 0,
    pokemonList: Pokemon[] = []
  ) {
    if (!name || name.trim() === "") {
      throw new Error("Name cannot be empty");
    }
    if (level === undefined || level === null || level < 0) {
      throw new Error("Level must be a non-negative number");
    }
    if (xp === undefined || xp === null || xp < 0) {
      throw new Error("XP must be a non-negative number");
    }
    if (!pokemonList || !Array.isArray(pokemonList)) {
      throw new Error("Pokemon list must be an array");
    }
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.pokemonList = pokemonList;
  }

  // getters
  public getName(): string {
    return this.name;
  }
  public getLevel(): number {
    return this.level;
  }
  public getXP(): number {
    return this.xp;
  }
  public getPokemonList(): Pokemon[] {
    return this.pokemonList;
  }

  // setters
  public setName(name: string): string {
    if (!name || name.trim() === "") {
      throw new Error("Name cannot be empty");
    }
    this.name = name;
    return this.name;
  }
  public setLevel(level: number): number {
    if (level === undefined || level === null || level < 0) {
      throw new Error("Level must be a non-negative number");
    }
    this.level = level;
    return this.level;
  }
  public setXP(xp: number): number {
    if (xp === undefined || xp === null || xp < 0) {
      throw new Error("XP must be a non-negative number");
    }
    this.xp = xp;
    return this.xp;
  }
  public setPokemonList(pokemonList: Pokemon[]): Pokemon[] {
    if (!pokemonList || !Array.isArray(pokemonList)) {
      throw new Error("Pokemon list must be an array");
    }
    this.pokemonList = pokemonList;
    return this.pokemonList;
  }

  // other methods
  public addPokemon(pokemon: Pokemon): void {
    if (!pokemon) {
      throw new Error("Pokemon parameter must be provided");
    }
    this.pokemonList.push(pokemon);
  }
  public healAllPokemons(): void {
    this.pokemonList.forEach((pokemon) => {
      pokemon.heal();
    });
  }

  public gainXP(points: number): void {
    if (points === undefined || points === null || points < 0) {
      throw new Error("XP points must be a non-negative number");
    }
    this.xp += points;
    if (this.xp >= 10) {
      this.level += 1;
      this.xp -= 10;
    }
  }
}
