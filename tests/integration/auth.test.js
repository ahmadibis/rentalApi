const request = require('supertest');
const { User } = require('../../models/users');
const mongoose = require('mongoose')
const { Genre } = require('../../models/genre');

describe('auth middleware', () => {
    beforeEach(async () => {
      server = require('../../index');
    });

    afterEach(async () => {
      await server.close();
       await Genre.deleteMany({});
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });

    let token

    const exec = () => {
       return  request(server).post('/api/genres').set('x-auth-token', token).send({name: 'genre1'})
    } 
     beforeEach(() => {
      token = new User().generateAuthToken()
    });

    it('should return 401 if no token is provided', async () => {
        token = ''
        const res = await exec()

        expect(res.status).toBe(401)
    })

    it('should return 400 if no token is invalid', async () => {
      token = 'a';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 if token is invalid', async () => {
     
      const res = await exec();

      expect(res.status).toBe(200);
    });
})