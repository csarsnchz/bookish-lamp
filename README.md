<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Instalar Docker
3. Instalar Nest CLI
```
npm i -g @nestjs/cli
```
4. Ejecutar
```
npm install o npm i
```
5. Levantar la base de datos
```
docker-compose up -d
```
6. Reconstruir la base de datos
```
http://localhost:3000/api/v2/seed
```

## Stack usado
* Nest
* Docker
* MongoDB

## Build
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

## Run
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up

## Nota
Por defecto, __docker-compose__ usa el archivo ```.env```, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con
```
docker-compose -f docker-compose.prod.yaml up --build
```