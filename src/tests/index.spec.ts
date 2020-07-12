import chai, { should } from 'chai';
import chaiHttp from 'chai-http';

import init from '..';
import { ChangeStream } from 'typeorm';

chai.use(chaiHttp);
chai.should();

let app;
let server;

let testingPostId: string;
let token: string;
let testEmail = "test@test.com";
let testPassword = "test"
let testingUserId: string;

describe("TESTS", () => {
    before(async function() {
        const appData = await init;
        app = appData.app;
        server = appData.server;
    });
    
    after(() => {
        server.close();
    });

    // AUTH TESTS

    // Register
    describe("POST auth/register", () => {
        it("Should create a new user", (done) => {
            chai.request(app)
                .post("/auth/register")
                .send({
                    name: "Test",
                    username: "@Test",
                    email: testEmail,
                    password: testPassword
                })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    testingUserId = response.body.data.id;
                    done();
                });
        });
    });

    // Login
    describe("POST auth/login", () => {
        it("Should get a token", (done) => {
            chai.request(app)
                .post('/auth/login')
                .send({email: testEmail, password: testPassword})
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    token = response.body.token;
                    done();
                });
        });
    });

    // POSTS TESTS

    // Get all posts
    describe("GET /posts", () => {
        //Test to get all posts
        it("Should get all posts", (done) => {
            chai.request(app)
                .get('/posts')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    testingPostId = response.body.data[0].id;
                    done();
                });
        });
    });
    //Get one post
    describe("GET /posts/:id", () => {
        it("Should get one post", (done) => {
            chai.request(app)
                .get(`/posts/${testingPostId}`)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    done();
                });
        });
    });

    //Create a post (Requires auth)
    describe("POST /posts/", () => {
        it("Should create a post and get it data", (done) => {
            chai.request(app)
                .post("/posts/")
                .set("Authorization", `Bearer ${token}`)
                .send({body: "Testing Post"})
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    testingPostId = response.body.data.id;
                    done();
                });
        });
    });

    //Delete a post
    describe("DELETE /posts/:id", () => {
        it("Should delete a post", (done) => {
            chai.request(app)
                .delete(`/posts/${testingPostId}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });
    });

    // USERS TESTS

    //Delete user
    describe("DELETE /users/:id", () => {
        it("Should delete a user", (done) => {
            chai.request(app)
                .delete(`/users/${testingUserId}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                })
        })
    })
});
