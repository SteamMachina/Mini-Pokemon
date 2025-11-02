import { TrainerModel } from "../models/TrainerModel";
import { PokemonModel } from "../models/PokemonModel";
import { AttackModel } from "../models/AttackModel";
import { Attack } from "../services/Attack";
import { Pokemon } from "../services/Pokemon";
import { Trainer } from "../services/Trainer";
import { Router, Request, Response } from "express";

const router = Router();

const trainerModel = new TrainerModel();
const pokemonModel = new PokemonModel();
const attackModel = new AttackModel();

function serializeTrainer(trainer: Trainer) {
  return {
    name: trainer.getName(),
    level: trainer.getLevel(),
    experience: trainer.getXP(),
  };
}

function serializePokemon(pokemon: Pokemon) {
  return {
    name: pokemon.getName(),
    lifePoints: pokemon.getLifePoints(),
    maxLifePoints: pokemon.getMaxLifePoints(),
  };
}

function serializeAttack(attack: Attack) {
  return {
    name: attack.getName(),
    damage: attack.getDamage(),
    usageLimit: attack.getUsageLimit(),
    usageCounter: attack.getUsageCounter(),
  };
}

router.get("/trainers", async (req: Request, res: Response) => {
  try {
    const trainers = await trainerModel.findAll();
    res.json(trainers.map(serializeTrainer));
  } catch (err) {
    console.error("Failed to list trainers", err);
    res.status(500).json({ error: "Failed to list trainers" });
  }
});

router.get("/pokemons", async (req: Request, res: Response) => {
  try {
    const pokemons = await pokemonModel.findAll();
    res.json(pokemons.map(serializePokemon));
  } catch (err) {
    console.error("Failed to list pokemons", err);
    res.status(500).json({ error: "Failed to list pokemons" });
  }
});

router.get("/attacks", async (req: Request, res: Response) => {
  try {
    const attacks = await attackModel.findAll();
    res.json(attacks.map(serializeAttack));
  } catch (err) {
    console.error("Failed to list attacks", err);
    res.status(500).json({ error: "Failed to list attacks" });
  }
});

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

router.post("/pokemons", async (req: Request, res: Response) => {
  try {
    const { name, lifePoints, maxLifePoints } = req.body;
    const pokemonObj = new Pokemon(name, lifePoints, maxLifePoints);
    const pokemonDb = await pokemonModel.create(pokemonObj);
    res.status(201).json(serializePokemon(pokemonObj));
  } catch (err) {
    console.error("Failed to find create pokemon", err);
    res.status(500).json({ error: "Failed to create pokemon" });
  }
});

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
//route défi aléatoire
//route arène 1
//route défi déterministe
//route arène 2

export default router;
