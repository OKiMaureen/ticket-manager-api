import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import chai from 'chai';
import TestFactory from '../factory';
import MockStory from '../src/mockData/story';
import MockUser from '../src/mockData/user';
import {
    success, fail, storyCreated, storiesList,
    storyAssigned, storyNotFound, adminNotFound,
    storyApproved, storyRejected, storyDuplicateApproved, storyDuplicateRejected
} from '../src/utils/messages';

const { expect } = chai;
chai.use(chaiLike);
chai.use(chaiThings);
const userStoryUrl = '/api/v1/stories/user';
const signupUrl = '/api/v1/auth/signup';
const adminStoryUrl = '/api/v1/stories/admin';
const assignStoryUrl = '/api/v1/story/1/assign';
const approveUrl = '/api/v1/story/1/approve';
const rejectUrl = '/api/v1/story/1/reject';
const assignStoryUrlWithWrongStoryId = '/api/v1/story/10/assign';
let userToken: string;
let userToken2: string;
let adminToken: string;

describe('Test Story', () => {

    const factory: TestFactory = new TestFactory()
    const user1: MockUser = MockUser.correctUserDetails();
    const admin: MockUser = MockUser.correctAdminDetails();
    const user2: MockUser = MockUser.correctUserDetailsTwo();
    const story1: MockStory = MockStory.correctStoryDetails();
    const story2: MockStory = MockStory.correctStoryDetailsTwo();

    before(async () => {
        await factory.init();
    })
    after(async () => {
        await factory.close();
    })
    before((done) => {
        factory.app
            .post(`${signupUrl}`)
            .send(user1)
            .end((err, res) => {
                userToken = res.body.data.token;
                done();
            });
    });
    before((done) => {
        factory.app
            .post(`${signupUrl}`)
            .send(user2)
            .end((err, res) => {
                userToken2 = res.body.data.token;
                done();
            });
    });
    before((done) => {
        factory.app
            .post(`${signupUrl}`)
            .send(admin)
            .end((err, res) => {

                adminToken = res.body.data.token;
                done();
            });
    });
    describe('POST /api/v1/stories/user', () => {
        it('should create a user story for user1 ', (done) => {
            factory.app
                .post(`${userStoryUrl}`)
                .set('token', userToken)
                .send(story1)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status, data } = res.body;
                        expect(res).to.have.status(201);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(storyCreated);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('story');
                        expect(data.story.summary).to.equal('test summary');
                        expect(data.story.description).to.equal('test description');
                        expect(data.story.type).to.equal('feature type');
                        expect(data.story.complexity).to.equal(20);
                        expect(data.story.cost).to.equal(2000);
                        expect(data.story.estimatedFinishTimeInMins).to.equal(120);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should create a user story for user2 ', (done) => {
            factory.app
                .post(`${userStoryUrl}`)
                .set('token', userToken2)
                .send(story2)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status, data } = res.body;
                        expect(res).to.have.status(201);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(storyCreated);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('story');
                        expect(data.story.summary).to.equal('test summary two');
                        expect(data.story.description).to.equal('test description two');
                        expect(data.story.type).to.equal('feature type two');
                        expect(data.story.complexity).to.equal(10);
                        expect(data.story.estimatedFinishTimeInMins).to.equal(30);
                        expect(data.story.cost).to.equal(2000);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should take only numbers for cost', (done) => {
            factory.app
                .post(`${userStoryUrl}`)
                .set('token', userToken)
                .send({
                    summary: 'test summary',
                    description: 'test description',
                    type: 'feature type',
                    complexity: 20,
                    cost: 'not number',
                    estimatedFinishTimeInMins: 50
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isNumber');
                        expect(data.error.isNumber).to.equal('Cost should be a number.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should take only numbers for complexity', (done) => {
            factory.app
                .post(`${userStoryUrl}`)
                .set('token', userToken)
                .send({
                    summary: 'test summary',
                    description: 'test description',
                    type: 'feature type',
                    complexity: 'not number',
                    cost: 20000,
                    estimatedFinishTimeInMins: 50
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isNumber');
                        expect(data.error.isNumber).to.equal('Complexity should be a number.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should take only numbers for estimatedfinishtime', (done) => {
            factory.app
                .post(`${userStoryUrl}`)
                .set('token', userToken)
                .send({
                    summary: 'test summary',
                    description: 'test description',
                    type: 'feature type',
                    complexity: 20,
                    cost: 20000,
                    estimatedFinishTimeInMins: '50'
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isNumber');
                        expect(data.error.isNumber).to.equal('Estimated finish time should be a number.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not allow unauthenticated users', (done) => {
            factory.app
                .post(`${userStoryUrl}`)
                .send({
                    summary:
                        'test summary',
                    description:
                        'test description',
                    type:
                        'feature type',
                    complexity: 20,
                    cost: 20000,
                    estimatedFinishTimeInMins: '50'
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { status, message } = res.body;
                        expect(res).to.have.status(401);
                        expect(status).to.equal(fail);
                        expect(message).to.equal('Invalid token or token not provided.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
    });
    describe('GET /api/v1/stories/user', () => {
        it('should get all stories that was created by an authenticated user one', (done) => {
            factory.app
                .get(`${userStoryUrl}`)
                .set('token', userToken)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status, data } = res.body;
                        expect(res).to.have.status(200);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(storiesList);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('stories');
                        expect(data.stories).to.be.an('array');
                        expect(data.stories[0]).to.be.an('object');
                        expect(data.stories[0].complexity).to.equal(20);
                        expect(data.stories[0].cost).to.equal(2000);
                        expect(data.stories[0].description).to.equal('test description');
                        expect(data.stories[0].estimatedFinishTimeInMins).to.equal(120);
                        expect(data.stories[0].id).to.equal(1);
                        expect(data.stories[0].summary).to.equal('test summary');
                        expect(data.stories[0].ticketStatus).to.equal('pending');
                        expect(data.stories[0].type).to.equal('feature type');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
    });
    describe('GET /api/v1/stories/admin', () => {
        it('should get all users stories for an admin', (done) => {
            factory.app
                .get(`${adminStoryUrl}`)
                .set('token', adminToken)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status, data } = res.body;
                        expect(res).to.have.status(200);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(storiesList);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('stories');
                        expect(data.stories).to.be.an('array');
                        expect(data.stories[0].id).to.equal(1);
                        expect(data.stories[1].id).to.equal(2);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
    });
    describe('PUT /api/v1/story/:id/assign', () => {
        it('should assign a user story to an admin successfully', (done) => {
            factory.app
                .put(`${assignStoryUrl}`)
                .set('token', userToken)
                .send({
                    adminId: 3,
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status, data } = res.body;
                        expect(res).to.have.status(200);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(storyAssigned);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('story');
                        expect(data.story.summary).to.equal('test summary');
                        expect(data.story.description).to.equal('test description');
                        expect(data.story.type).to.equal('feature type');
                        expect(data.story.complexity).to.equal(20);
                        expect(data.story.estimatedFinishTimeInMins).to.equal(120);
                        expect(data.story.cost).to.equal(2000);
                        expect(data.story.ticketStatus).to.equal('pending');
                        expect(data.story.assignee).to.be.an('object');
                        expect(data.story.assignee.id).to.equal(3);
                        expect(data.story.assignee.userName).to.equal('adminUserName');
                        expect(data.story.assignee.email).to.equal('admin@email.com');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not assign a user story to an admin if story id is not found', (done) => {
            factory.app
                .put(`${assignStoryUrlWithWrongStoryId}`)
                .set('token', userToken)
                .send({
                    adminId: 3,
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status } = res.body;
                        expect(res).to.have.status(404);
                        expect(message).to.equal(storyNotFound);
                        expect(status).to.equal(fail);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not assign a user story to an admin if admin id is not found', (done) => {
            factory.app
                .put(`${assignStoryUrl}`)
                .set('token', userToken)
                .send({
                    adminId: 30,
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status } = res.body;
                        expect(res).to.have.status(404);
                        expect(message).to.equal(adminNotFound);
                        expect(status).to.equal(fail);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
    });
    describe('PUT /api/v1/story/:id/approve', () => {
        it('should approve a pending story', (done) => {
            factory.app
                .put(`${approveUrl}`)
                .set('token', adminToken)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status, data } = res.body;
                        expect(res).to.have.status(200);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(storyApproved);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('story');
                        expect(data.story.summary).to.equal('test summary');
                        expect(data.story.description).to.equal('test description');
                        expect(data.story.type).to.equal('feature type');
                        expect(data.story.complexity).to.equal(20);
                        expect(data.story.estimatedFinishTimeInMins).to.equal(120);
                        expect(data.story.cost).to.equal(2000);
                        expect(data.story.ticketStatus).to.equal('approved');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should approve a rejected story', (done) => {
            factory.app
                .put('/api/v1/story/2/approve')
                .set('token', adminToken)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status, data } = res.body;
                        expect(res).to.have.status(200);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(storyApproved);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('story');
                        expect(data.story.summary).to.equal('test summary two');
                        expect(data.story.description).to.equal('test description two');
                        expect(data.story.type).to.equal('feature type two');
                        expect(data.story.complexity).to.equal(10);
                        expect(data.story.estimatedFinishTimeInMins).to.equal(30);
                        expect(data.story.cost).to.equal(2000);
                        expect(data.story.ticketStatus).to.equal('approved');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not approve an approved story', (done) => {
            factory.app
                .put('/api/v1/story/2/approve')
                .set('token', adminToken)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status } = res.body;
                        expect(res).to.have.status(403);
                        expect(message).to.equal(storyDuplicateApproved);
                        expect(status).to.equal(fail);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should reject an approved story', (done) => {
            factory.app
                .put(`${rejectUrl}`)
                .set('token', adminToken)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status, data } = res.body;
                        expect(res).to.have.status(200);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(storyRejected);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('story');
                        expect(data.story.summary).to.equal('test summary');
                        expect(data.story.description).to.equal('test description');
                        expect(data.story.type).to.equal('feature type');
                        expect(data.story.complexity).to.equal(20);
                        expect(data.story.estimatedFinishTimeInMins).to.equal(120);
                        expect(data.story.cost).to.equal(2000);
                        expect(data.story.ticketStatus).to.equal('rejected');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
    });
    describe('PUT /api/v1/story/:id/reject', () => {
        it('should not reject a rejected story', (done) => {
            factory.app
                .put(`${rejectUrl}`)
                .set('token', adminToken)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status } = res.body;
                        expect(res).to.have.status(403);
                        expect(message).to.equal(storyDuplicateRejected);
                        expect(status).to.equal(fail);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not accept wrong story ids', (done) => {
            factory.app
                .put('/api/v1/story/20/approve')
                .set('token', adminToken)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status } = res.body;
                        expect(res).to.have.status(404);
                        expect(message).to.equal(storyNotFound);
                        expect(status).to.equal(fail);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
    });


});
