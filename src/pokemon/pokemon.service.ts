import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({ no: 1 })
    .select('-__v')
    .exec();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    try {
      if (!isNaN(+term)) {
        pokemon = await this.pokemonModel.findOne({ no: term}).exec();
      }
      if (!pokemon && isValidObjectId(term)) {
        pokemon = await this.pokemonModel.findById(term).exec();
        }
      if (!pokemon) {
        pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() }).exec();
      }
    } catch (error) {
      throw new InternalServerErrorException(`Error finding pokemon: ${error}`);
    }
    if (!pokemon) {
      throw new NotFoundException(`Pokemon not found with id, name or no: ${term}`);
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
     this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      const pokemon = await this.findOne(id);
      try {
        if (pokemon) {
          this.pokemonModel.deleteOne({ _id: pokemon._id }).exec();
          return `Pokemon ${pokemon.name} deleted successfully`;
        } else {
          throw new NotFoundException(`Pokemon not found with id: ${id}`);
        }
      } catch (error) {
        throw new InternalServerErrorException(`Error deleting pokemon: ${error}`);
      }
    } else {
      const result = await this.pokemonModel.findByIdAndDelete(id).exec();
      if (result) {
        return `Pokemon deleted successfully ${result}`;
      } else {
        throw new NotFoundException(`Pokemon not found with id: ${id}`);
      }
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists: ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException(`Error creating pokemon: ${error}`);
  }
}
