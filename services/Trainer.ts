import { Pokemon } from "./Pokemon";

export class Trainer {
  private name: string;
  private level: number;
  private xp: number;
  private pokemonList: Pokemon[];
  private id: number;

  public constructor(
    name: string = "Sasha",
    level: number = 0,
    xp: number = 0,
    pokemonList: Pokemon[] = [],
    id: number = 0
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
    this.id = id;
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
  public getId(): number {
    return this.id;
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

  public setId(id: number): number {
    if (id === undefined || id === null || id < 0) {
      throw new Error("ID must be a non-negative number");
    }
    this.id = id;
    return this.id;
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

  public gainXP(): void {
    const points = 1;
    this.xp += points;
    if (this.xp >= 10) {
      this.level += 1;
      this.xp -= 10;
    }
  }

  public livePokemons(): Pokemon[] {
    let alivePokemons: Pokemon[] = [];
    this.pokemonList.forEach((pokemon) => {
      if (pokemon.getLifePoints() > 0) {
        alivePokemons.push(pokemon);
      }
    });
    if (alivePokemons.length == 0) {
      console.log(`${this.getName()} has no alive pokemons.`);
    }
    return alivePokemons;
  }

  chooseRandomPokemon(): Pokemon | null {
    const livePokemons = this.livePokemons();
    if (livePokemons.length === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * livePokemons.length);
    const chosenPokemon = livePokemons[index];
    console.log(`${this.getName()} chose ${chosenPokemon.getName()}.`);
    return chosenPokemon;
  }

  chooseBestPokemon(): Pokemon | null {
    let livePokemons = this.livePokemons();
    if (livePokemons.length === 0) {
      return null;
    }
    let bestPokemon = livePokemons[0];
    livePokemons.forEach((pokemon) => {
      if (pokemon.getLifePoints() > bestPokemon.getLifePoints()) {
        bestPokemon = pokemon;
      }
    });
    console.log(`${this.getName()} chose ${bestPokemon.getName()}.`);
    return bestPokemon;
  }

  public dispScore(): void {
    console.log(
      `${this.getName()} is level ${this.getLevel()} with ${this.getXP()} XP.`
    );
  }
}
