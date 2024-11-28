import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const testEmail = 'asdlkq@kl4.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: 'password' }) // Properly formatted body
      .expect(201)
      .then((res) => {
        console.log("req.boyd",res.body)
        const { id, email } = res.body;
        expect(id).toBeDefined(); // Check if id exists
        expect(email).toEqual(testEmail); // Compare with the correct email
      });
  });
  
  it('handles a signup request', () => {
    const testEmail = 'asdlkq@kl4.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: 'password' }) // Properly formatted body
      .expect(201)
      .then((res) => {
        console.log("req.boyd",res.body)
        const { id, email } = res.body;
        expect(id).toBeDefined(); // Check if id exists
        expect(email).toEqual(testEmail); // Compare with the correct email
      });
  });
});
