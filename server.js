//import { createServer } from 'node:http';

//const server = createServer((request, response) => {

//    response.write('hello word');

//    return response.end();

//});

//server.listen(3333);

import { fastify } from "fastify";
//import { DataBaseMemory } from "./database-memory.js"
import { DataBasePostgres } from "./database-postgres.js";

const server = fastify();

//const database = new DataBaseMemory();
const database = new DataBasePostgres()

server.post ('/videos', async (request, replay)=>{
    const { title, description, duration} = request.body

    await database.create({
        title,
        description,
        duration,

    });

    return replay.status(201).send();

});
server.get ('/videos', async (request)=>{
    const search = request.query.search

    const videos = await database.list(search)

    return videos
});
server.put ('/videos/:id',async (request, replay)=>{
    const videoId = request.params.id
    const { title, description, duration} = request.body

    await database.update(videoId, {
        title,
        description,
        duration,
    })
    return replay.status(204).send()
});
server.delete ('/videos/:id', async (request, replay)=>{
    const videoId = request.params.id

    await database.delete(videoId)

    return replay.status(204).send()
});

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333,
});