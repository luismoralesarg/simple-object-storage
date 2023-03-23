import { expect } from 'chai';
import request from 'supertest';
import { app } from '../src/app';

describe('Object Storage Service API', () => {
  const bucketName = 'test-bucket';
  const key = 'test-key';
  const objectData = Buffer.from('test-object-data');

  describe(`GET /objects/${bucketName}/${key}`, () => {
    it.only('should return 200 OK with the object data', async () => {
      const res = await request(app).get(`/objects/${bucketName}/${key}`);
      console.log(res)
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(objectData);
    });

    it('should return 404 Not Found for a nonexistent key', async () => {
      const nonexistentKey = 'nonexistent-key';
      const res = await request(app).get(`/objects/${bucketName}/${nonexistentKey}`);
      expect(res.status).to.equal(404);
    });
  });

  describe(`PUT /objects/${bucketName}/${key}`, () => {
    it('should return 200 OK and store the object data', async () => {
      const res = await request(app)
        .put(`/objects/${bucketName}/${key}`)
        .send(objectData);
      expect(res.status).to.equal(200);

      // Verify that the object was stored by retrieving it again
      const res2 = await request(app).get(`/objects/${bucketName}/${key}`);
      expect(res2.status).to.equal(200);
      expect(res2.body).to.deep.equal(objectData);
    });
  });
});