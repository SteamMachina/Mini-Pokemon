import { TrainerModel } from "../models/TrainerModel";
import { PokemonModel } from "../models/PokemonModel";
import { AttackModel } from "../models/AttackModel";
import { Attack } from "../services/Attack";
import { Pokemon } from "../services/Pokemon";
import { Trainer } from "../services/Trainer";
import { Combat } from "../services/Combat";
import { Router, Request, Response } from "express";
import { pool } from "../config/database";

const router = Router();

const trainerModel = new TrainerModel();
const pokemonModel = new PokemonModel();
const attackModel = new AttackModel();
//function to serialize a trainer
function serializeTrainer(trainer: Trainer) {
  return {
    name: trainer.getName(),
    level: trainer.getLevel(),
    experience: trainer.getXP(),
    id: trainer.getId(),
    pokemonList: trainer.getPokemonList().map(serializePokemon),
  };
}
//function to serialize a pokemon
function serializePokemon(pokemon: Pokemon) {
  return {
    name: pokemon.getName(),
    lifePoints: pokemon.getLifePoints(),
    maxLifePoints: pokemon.getMaxLifePoints(),
    id: pokemon.getId(),
    attacks: pokemon.getAttacks().map(serializeAttack),
  };
}
//function to serialize an attack
function serializeAttack(attack: Attack) {
  return {
    name: attack.getName(),
    damage: attack.getDamage(),
    usageLimit: attack.getUsageLimit(),
    usageCounter: attack.getUsageCounter(),
    id: attack.getId(),
  };
}
//route to get all trainers
router.get("/trainers", async (req: Request, res: Response) => {
  try {
    const trainers = await trainerModel.findAll();
    res.json(trainers.map(serializeTrainer));
  } catch (err) {
    console.error("Failed to list trainers", err);
    res.status(500).json({ error: "Failed to list trainers" });
  }
});

//route to get all pokemons
router.get("/pokemons", async (req: Request, res: Response) => {
  try {
    const pokemons = await pokemonModel.findAll();
    res.json(pokemons.map(serializePokemon));
  } catch (err) {
    console.error("Failed to list pokemons", err);
    res.status(500).json({ error: "Failed to list pokemons" });
  }
});

//route to get all attacks
router.get("/attacks", async (req: Request, res: Response) => {
  try {
    const attacks = await attackModel.findAll();
    res.json(attacks.map(serializeAttack));
  } catch (err) {
    console.error("Failed to list attacks", err);
    res.status(500).json({ error: "Failed to list attacks" });
  }
});

//route to get an attack by id
router.get("/attacks/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"], 10);
    const attack = await attackModel.findById(id);
    res.json(serializeAttack(attack));
  } catch (err) {
    console.error("Failed to find attack", err);
    res.status(500).json({ error: "Failed to find attack" });
  }
});

//route to create a new pokemon
router.post("/pokemons", async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }
    const { name, lifePoints, maxLifePoints } = req.body;
    if (!name || lifePoints === undefined || maxLifePoints === undefined) {
      return res
        .status(400)
        .json({ error: "name, lifePoints, and maxLifePoints are required" });
    }
    const pokemonObj = new Pokemon(name, lifePoints, maxLifePoints);
    const pokemonId = await pokemonModel.create(pokemonObj);
    pokemonObj.setId(pokemonId);
    res.status(201).json(serializePokemon(pokemonObj));
  } catch (err) {
    console.error("Failed to create pokemon", err);
    res.status(500).json({ error: "Failed to create pokemon" });
  }
});

//route to heal a trainer's pokemons
router.put("/trainers/:trainerId/heal", async (req: Request, res: Response) => {
  try {
    const trainerId = parseInt(req.params["trainerId"], 10);
    const trainer = await trainerModel.findById(trainerId);
    trainer.healAllPokemons();
    await trainerModel.healAllPokemons(trainerId);
    // Reload trainer to get updated data
    const updatedTrainer = await trainerModel.findById(trainerId);
    res.status(200).json(serializeTrainer(updatedTrainer));
  } catch (err) {
    console.error("Failed to heal trainer's pokemons", err);
    res.status(500).json({ error: "Failed to heal trainer's pokemons" });
  }
});
//route to create a new attack
router.post("/attacks", async (req: Request, res: Response) => {
  try {
    const { name, damage, usageLimit } = req.body;
    const attackObj = new Attack(name, damage, usageLimit);
    const attackId = await attackModel.create(attackObj);
    attackObj.setId(attackId);
    res.status(201).json(serializeAttack(attackObj));
  } catch (err) {
    console.error("Failed to find create attack", err);
    res.status(500).json({ error: "Failed to create attack" });
  }
});

//route to create a new trainer
router.post("/trainers", async (req: Request, res: Response) => {
  try {
    const { name, level, experience } = req.body;
    const trainerObj = new Trainer(name, level, experience);
    const trainerId = await trainerModel.create(trainerObj);
    trainerObj.setId(trainerId);
    res.status(201).json(serializeTrainer(trainerObj));
  } catch (err) {
    console.error("Failed to find create trainer", err);
    res.status(500).json({ error: "Failed to create trainer" });
  }
});

//route to add pokemon to trainer
router.put("/trainers/addpokemon", async (req: Request, res: Response) => {
  try {
    const { trainerId, pokemonId } = req.body;
    const trainer = await trainerModel.findById(parseInt(trainerId, 10));
    const pokemon = await pokemonModel.findById(parseInt(pokemonId, 10));
    trainer.addPokemon(pokemon);
    await trainerModel.addPokemon(trainerId, pokemonId);
    res.status(201).json(serializeTrainer(trainer));
  } catch (err) {
    console.error("Failed to add pokemon", err);
    res.status(500).json({ error: "Failed to add pokemon" });
  }
});

//route to add attack to pokemon
router.post("/pokemons/addattack", async (req: Request, res: Response) => {
  try {
    const { pokemonId, attackId } = req.body;
    const pokemon = await pokemonModel.findById(pokemonId);
    const attack = await attackModel.findById(attackId);
    pokemon.learn(attack);
    await pokemonModel.addAttack(pokemonId, attackId);
    res.status(201).json(serializePokemon(pokemon));
  } catch (err) {
    console.error("Failed to add attack to pokemon", err);
    res.status(500).json({ error: "Failed to add attack to pokemon" });
  }
});

//route to run a random battle
router.put("/combat/random", async (req: Request, res: Response) => {
  try {
    const { trainer1Id, trainer2Id } = req.body;
    const trainer1 = await trainerModel.findById(trainer1Id);
    const trainer2 = await trainerModel.findById(trainer2Id);
    const combat = new Combat();
    const trainers = combat.randomBattle([trainer1, trainer2]);
    await trainerModel.update(trainer1Id, trainers[0]);
    await trainerModel.update(trainer2Id, trainers[1]);

    const pokemons1 = trainers[0].getPokemonList();
    const pokemons2 = trainers[1].getPokemonList();

    pokemons1.forEach(async (pokemon) => {
      await pokemonModel.update(pokemon.getId(), pokemon);
    });
    pokemons2.forEach(async (pokemon) => {
      await pokemonModel.update(pokemon.getId(), pokemon);
    });

    res.status(200).json(trainers.map(serializeTrainer));
  } catch (err) {
    console.error("Failed to run random battle", err);
    res.status(500).json({ error: "Failed to run random battle" });
  }
});

//route to run a determinist battle
router.put("/combat/determinist", async (req: Request, res: Response) => {
  try {
    const { trainer1Id, trainer2Id } = req.body;
    const trainer1 = await trainerModel.findById(trainer1Id);
    const trainer2 = await trainerModel.findById(trainer2Id);
    const combat = new Combat();
    const trainers = combat.deterministBattle([trainer1, trainer2]);
    await trainerModel.update(trainer1Id, trainers[0]);
    await trainerModel.update(trainer2Id, trainers[1]);

    const pokemons1 = trainers[0].getPokemonList();
    const pokemons2 = trainers[1].getPokemonList();

    pokemons1.forEach(async (pokemon) => {
      await pokemonModel.update(pokemon.getId(), pokemon);
    });
    pokemons2.forEach(async (pokemon) => {
      await pokemonModel.update(pokemon.getId(), pokemon);
    });

    res.status(200).json(trainers.map(serializeTrainer));
  } catch (err) {
    console.error("Failed to run determinist battle", err);
    res.status(500).json({ error: "Failed to run determinist battle" });
  }
});

//route to run a random gym
router.put("/combat/randomgym", async (req: Request, res: Response) => {
  try {
    const { trainer1Id, trainer2Id } = req.body;
    const trainer1 = await trainerModel.findById(trainer1Id);
    const trainer2 = await trainerModel.findById(trainer2Id);
    const combat = new Combat();
    const trainers = combat.randomGym([trainer1, trainer2]);
    await trainerModel.update(trainer1Id, trainers[0]);
    await trainerModel.update(trainer2Id, trainers[1]);

    const pokemons1 = trainers[0].getPokemonList();
    const pokemons2 = trainers[1].getPokemonList();

    pokemons1.forEach(async (pokemon) => {
      await pokemonModel.update(pokemon.getId(), pokemon);
    });
    pokemons2.forEach(async (pokemon) => {
      await pokemonModel.update(pokemon.getId(), pokemon);
    });

    res.status(200).json(trainers.map(serializeTrainer));
  } catch (err) {
    console.error("Failed to run random gym", err);
    res.status(500).json({ error: "Failed to run random gym" });
  }
});

//route to run a determinist gym

router.put("/combat/deterministgym", async (req: Request, res: Response) => {
  try {
    const { trainer1Id, trainer2Id } = req.body;
    const trainer1 = await trainerModel.findById(trainer1Id);
    const trainer2 = await trainerModel.findById(trainer2Id);
    const combat = new Combat();
    const trainers = combat.deterministGym([trainer1, trainer2]);
    await trainerModel.update(trainer1Id, trainers[0]);
    await trainerModel.update(trainer2Id, trainers[1]);

    const pokemons1 = trainers[0].getPokemonList();
    const pokemons2 = trainers[1].getPokemonList();

    pokemons1.forEach(async (pokemon) => {
      await pokemonModel.update(pokemon.getId(), pokemon);
    });
    pokemons2.forEach(async (pokemon) => {
      await pokemonModel.update(pokemon.getId(), pokemon);
    });

    res.status(200).json(trainers.map(serializeTrainer));
  } catch (err) {
    console.error("Failed to run determinist gym", err);
    res.status(500).json({ error: "Failed to run determinist gym" });
  }
});

export default router;
