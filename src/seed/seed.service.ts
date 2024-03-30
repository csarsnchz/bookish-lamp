import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly seedData: AxiosInstance = axios;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async executeSeed() {
    const { data } = await this.seedData.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const pokemons: { no: number; name: string }[] = [];
    data.results.forEach(async ({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemons.push({ no, name });
    });
    await this.pokemonModel.insertMany(pokemons);
    return 'Seed executed successfully!';
  }
}
