// Be sure you have at least on post and one user already on the database
import chai, {should} from 'chai';
import chaiHttp from 'chai-http';

import init from '..';

chai.use(chaiHttp);
chai.should();

let app;
let server;

let testingPostId: string;
let newTestingPostId: string;
let token: string;
let testEmail = "test@test.com";
let testPassword = "test"
let testingUserId: string;
let followThis: string;
let testingCommentId: string;

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

    // Change password
    describe("POST auth/change-password", () => {
        it("Should change the password from the user", (done) => {
            chai.request(app)
                .put("/auth/change-password")
                .set("Authorization", `Bearer ${token}`)
                .send({oldPassword: testPassword, newPassword: "123456"})
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                })
        })
    })

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

    //Create a post
    describe("POST /posts/", () => {
        it("Should create a post and get it data", (done) => {
            chai.request(app)
                .post("/posts/")
                .set("Authorization", `Bearer ${token}`)
                .send({body: "Testing Post"})
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    newTestingPostId = response.body.data.id;
                    done();
                });
        });
    });

    //Delete a post
    describe("DELETE /posts/:id", () => {
        it("Should delete a post", (done) => {
            chai.request(app)
                .delete(`/posts/${newTestingPostId}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });
    });

    // Like a post (Twice, cause the first time it creates a like and the second one removes it)
    describe("PUT /posts/like/:id", () => {
        it("Should like a post and return it", (done) => {
            chai.request(app)
                .put(`/posts/like/${testingPostId}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("PUT /posts/like/:id", () => {
        it("Should remove the like from the post", (done) => {
            chai.request(app)
                .put(`/posts/like/${testingPostId}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });
    });

    // Get comments from post
    describe("GET /posts/comments/:id", () => {
        it("Should get all the comments from a single post", (done) => {
            chai.request(app)
                .get(`/posts/comments/${testingPostId}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });
    });

	// COMMENTS TESTS
	
	// Post comment 
	describe("POST /comments/:id", () => {
		it("Should create a new comment", (done) => {
			chai.request(app)
				.post(`/comments/${testingPostId}`)
				.set("Authorization", `Bearer ${token}`)
				.send({body: "Testing comment"})
				.end((err, response) => {
					response.should.have.status(200);
					response.body.should.be.a("object");
					testingCommentId = response.body.data.id;
					done();
				});
		});
	});

	// Get single comment
	describe("GET /comments/:id", () => {
		it("Should return a single comment", (done) => {
			chai.request(app)
				.get(`/comments/${testingCommentId}`)
				.end((err, response) => {
					response.should.have.status(200);
					response.body.should.be.a("object");
					done();
				});
		});
	});

	// Like comment
	describe("PUT /comments/like/:id", () => {
		it("Should add a like to comment", (done) => {
			chai.request(app)
				.put(`/comments/like/${testingCommentId}`)
				.set("Authorization", `Bearer ${token}`)
				.end((err, response) => {
					response.should.have.status(200);
					response.body.should.be.a("object");
					done();
				})
		});
	});

	// Delete comment 
	describe("DELETE /comments/:id", () => {
		it("Should remove the comment", (done) => {
			chai.request(app)
				.delete(`/comments/${testingCommentId}`)
				.set("Authorization", `Bearer ${token}`)
				.end((err, response) => {
					response.should.have.status(200);
					response.body.should.be.a("object");
					done();
				});
		});
	});

    // USERS TESTS

    // Get all users
    describe("GET /users", () => {
        it("Should get all the users", (done) => {
            chai.request(app)
                .get("/users")
                .set("Authorization", `Bearer ${token}`)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    followThis = response.body.data[0].id;
                    done();
                });
        });
    });

    // Get one user
    describe("GET /users/:id", () => {
        it("Should get a single user", (done) => {
            chai.request(app)
                .get(`/users/${testingUserId}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });
    });

    // Update user
    describe("PUT /users/:id", () => {
        it("Should update the user data", (done) => {
            chai.request(app)
                .put(`/users/${testingUserId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "TestUser", 
                    username: "@Tester", 
                    email: "test@tester.es", 
                    activated: false
                })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });
    });

    // Follow someone
    describe("PUT /users/follow", () => {
        it("Should follow a user", (done) => {
            chai.request(app)
                .put(`/users/follow`)
                .set("Authorization", `Bearer ${token}`)
                .send({userId: followThis})
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });
    });

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
