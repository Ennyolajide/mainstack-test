import request from 'supertest';
import app from '../app';
import { faker } from '@faker-js/faker';
import User from '../models/User';
import mongoose from 'mongoose';



describe('Product Endpoints', () => {
    let authToken: string;
    let testProductId: string;

    // Generate dynamic mock user data using faker
    const mockUserData = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    beforeAll(async () => {

        // Register a new user using dynamic mock data
        const registerResponse = await request(app)
            .post('/api/auth/register')
            .send(mockUserData);

        // Log in with the registered user's credentials using dynamic mock data
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: mockUserData.email,
                password: mockUserData.password,
            });

        // Set authToken for further use in tests
        authToken = loginResponse.body.token;
    });


    it('should create a new product with an image', async () => {
        const fakeProductData = {
            name: faker.commerce.productName(),
            imageUrl: faker.image.url(),
            price: parseFloat(faker.commerce.price()),
        }
        const response = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${authToken}`)
            .send(fakeProductData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(fakeProductData.name);
        expect(response.body.price).toBe(fakeProductData.price);
        expect(response.body.imageUrl).toBe(fakeProductData.imageUrl);
        testProductId = response.body._id;
    });

    it('should create a batch of products', async () => {
        // Generate random data for a batch of products using faker
        const productBatch = Array.from({ length: 5 }, () => ({
            name: faker.commerce.productName(),
            imageUrl: faker.image.url(),
            price: parseFloat(faker.commerce.price()),
        }));

        const response = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${authToken}`)
            .send(productBatch);

        expect(response.status).toBe(201);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(productBatch.length);


        response.body.forEach((createdProduct: any) => {
            expect(createdProduct).toHaveProperty('_id');
            expect(createdProduct).toHaveProperty('name');
            expect(createdProduct).toHaveProperty('price');
            expect(createdProduct).toHaveProperty('imageUrl');
        });
    });


    it('should get all products', async () => {
        const response = await request(app)
            .get('/api/products')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('should update other fields of a product', async () => {
        const fakeProductData = {
            name: faker.commerce.productName(),
            imageUrl: faker.image.url(),
            price: parseFloat(faker.commerce.price()),
        }
        const response = await request(app)
            .put(`/api/products/${testProductId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(fakeProductData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', testProductId);
        expect(response.body.name).toBe(fakeProductData.name);
        expect(response.body.price).toBe(fakeProductData.price);
        expect(response.body.imageUrl).toBe(fakeProductData.imageUrl);
    });

    it('should delete a product', async () => {
        const response = await request(app)
            .delete(`/api/products/${testProductId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product deleted successfully');
    });

    afterAll(async () => {
        // Delete the user created during the test
        await User.deleteOne({ email: mockUserData.email });
        await mongoose.disconnect();
    });
});
