import { Trainer } from "./Trainer";
import { Pokemon } from "./Pokemon";

export class Combat {
  RandomBattle(trainers: Trainer[]): Trainer {
    // choose random starter
    let trainer1: Trainer;
    let trainer2: Trainer;
    if (Math.floor(Math.random() * 2) === 0) {
      trainer1 = trainers[0];
      trainer2 = trainers[1];
    } else {
      trainer1 = trainers[1];
      trainer2 = trainers[0];
    }
    console.log(`${trainer1.getName} starts.`);

    // heal all pokemons
    trainer1.healAllPokemons();
    trainer2.healAllPokemons();
    console.log(`All pokemons healed.`);

    // select pokemons
    const pokemon1 = trainer1.chooseRandomPokemon();
    const pokemon2 = trainer2.chooseRandomPokemon();
    console.log(`${trainer1.getName} chose ${pokemon1.getName}.`);
    console.log(`${trainer2.getName} chose ${pokemon2.getName}.`);

    // battle until a pokemon dies
    let round = 0;
    while (pokemon1.getLifePoints() > 0 && pokemon2.getLifePoints() > 0) {
      round++;
      console.log(`Round ${round}:`);
      let attack1 = pokemon1.selectRandomAttack();
      console.log(
        `${pokemon1.getName} used ${attack1}.\n
        ${pokemon1.getName()} life points : ${pokemon1.getLifePoints()}\n
        ${pokemon2.getName()} life points : ${pokemon2.getLifePoints()}`
      );
      let attack2 = pokemon2.selectRandomAttack();
      console.log(
        `${pokemon2.getName} used ${attack2}.\n
        ${pokemon1.getName()} life points : ${pokemon1.getLifePoints()}\n
        ${pokemon2.getName()} life points : ${pokemon2.getLifePoints()}`
      );
    }

    if (pokemon1.getLifePoints() > 0) {
      console.log(`${trainer1} with ${pokemon1} won.`);
      return trainer1;
    } else {
      console.log(`${trainer2} with ${pokemon2} won.`);
      return trainer2;
    }
  }
}
