import chai from 'chai';
import chaiHttp from 'chai-http';

import init from '..';

chai.use(chaiHttp);
chai.should();

let app;

describe("TESTS", () => {
    before(async () => {
        console.log("Starting test");
        app = await init();
    });

    describe("GET /posts", () => {
        //Test to get all posts
        it("Should get all posts", (done) => {
            chai.request(app)
                .get('/posts')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    done();
                });
        });
    });
});
