import chai from 'chai';
import chaiHttp from 'chai-http';
import TestFactory from '../factory';
import MockUser from '../src/mockData/user'
import { success, fail, userExists, userCreated, incorrectCredentials, userLoggedIn } from '../src/utils/messages'


const { expect } = chai;
chai.use(chaiHttp);
const signupUrl = '/api/v1/auth/signup';
const signinUrl = '/api/v1/auth/signin';

describe('Test User', () => {
    const factory: TestFactory = new TestFactory()
    const user1: MockUser = MockUser.correctUserDetails();
    const user2: MockUser = MockUser.duplicateEmailUserDetails();
    const user3: MockUser = MockUser.duplicateUsernamelUserDetails();
    const user4: MockUser = MockUser.wrongEmailFormat();
    const user5: MockUser = MockUser.alphaNumUserNameFormat();
    const user6: MockUser = MockUser.emptyFirstNameField();
    const user7: MockUser = MockUser.emptySpacesFirstNameField();
    const user8: MockUser = MockUser.emptyLastNameField();
    const user9: MockUser = MockUser.emptySpacesLastNameField();
    const user10: MockUser = MockUser.emptyUserNameField();
    const user11: MockUser = MockUser.emptyPasswordField();
    const user12: MockUser = MockUser.correctUserDetailsTwo();

    before(async () => {
        await factory.init();
    })
    after(async () => {
        await factory.close();
    })
    describe('POST /api/v1/auth/signup', () => {
        it('It Should create user one with right signup details', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user1)
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { message, status, data } = res.body;
                        expect(res).to.have.status(201);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(userCreated);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('user');
                        expect(data.user.id).to.equal(1);
                        expect(data.user.firstName).to.equal('testFirstName');
                        expect(data.user.lastName).to.equal('testLastName');
                        expect(data.user.userName).to.equal('testUserName');
                        expect(data.user.email).to.equal('test@email.com');
                        expect(data.user.role).to.equal('user');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('It Should create user two with right signup details', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user12)
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { message, status, data } = res.body;
                        expect(res).to.have.status(201);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(userCreated);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('user');
                        expect(data.user.id).to.equal(2);
                        expect(data.user.firstName).to.equal('testFirstNameTwo');
                        expect(data.user.lastName).to.equal('testLastNameTwo');
                        expect(data.user.userName).to.equal('testUserNameTwo');
                        expect(data.user.email).to.equal('testTwo@email.com');
                        expect(data.user.role).to.equal('user');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not register a new user with an already existing email', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user2)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status } = res.body;
                        expect(res).to.have.status(409);
                        expect(message).to.equal(userExists);
                        expect(status).to.equal(fail);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not register a new user with an already existing username', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user3)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status } = res.body;
                        expect(res).to.have.status(409);
                        expect(message).to.equal(userExists);
                        expect(status).to.equal(fail);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not register user with a wrong email format', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user4)
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isEmail');
                        expect(data.error.isEmail).to.equal('Provide a valid email address');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should take alphanumeric chars for username', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user5)
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isAlphanumeric');
                        expect(data.error.isAlphanumeric).to.equal('Username must be alphanumeric.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not register user with an empty firstName field ', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user6)
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isNotEmpty');
                        expect(data.error.isNotEmpty).to.equal('Firstname is required.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not register user with an empty spaces firstName field ', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user7)
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isAlpha');
                        expect(data.error.isAlpha).to.equal('Firstname must be alphabetic.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not register user with an empty lastName field ', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user8)
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isNotEmpty');
                        expect(data.error.isNotEmpty).to.equal('Lastname is required.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not register user with an empty spaces lastName field ', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user9)
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isAlpha');
                        expect(data.error.isAlpha).to.equal('Lastname must be alphabetic.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not register user with an empty userName field ', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user10)
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isNotEmpty');
                        expect(data.error.isNotEmpty).to.equal('Username is required.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('should not register user with an empty password field ', (done) => {
            factory.app
                .post(`${signupUrl}`)
                .send(user11)
                .end((err, res) => {
                    try {
                        if (err) throw err;

                        const { status, data } = res.body;
                        expect(res).to.have.status(400);
                        expect(data).to.be.an('object')
                        expect(status).to.equal(fail);
                        expect(data).to.have.property('error');
                        expect(data.error).to.have.property('isNotEmpty');
                        expect(data.error.isNotEmpty).to.equal('Password is required.');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
    });
    describe('POST /api/v1/auth/signin', () => {
        it('It Should sigin users with right email signin details', (done) => {
            factory.app
                .post(`${signinUrl}`)
                .send({
                    userNameOrEmail: 'test@email.com',
                    password: 'testPassword'
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status, data } = res.body;
                        expect(res).to.have.status(200);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(userLoggedIn);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('user');
                        expect(data.user.id).to.equal(1);
                        expect(data.user.firstName).to.equal('testFirstName');
                        expect(data.user.lastName).to.equal('testLastName');
                        expect(data.user.userName).to.equal('testUserName');
                        expect(data.user.email).to.equal('test@email.com');
                        expect(data.user.role).to.equal('user');
                        expect(data).to.have.property('token');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('It Should sigin users with right  username signin details', (done) => {
            factory.app
                .post(`${signinUrl}`)
                .send({
                    userNameOrEmail: 'testUserName',
                    password: 'testPassword'
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status, data } = res.body;
                        expect(res).to.have.status(200);
                        expect(data).to.be.an('object')
                        expect(message).to.equal(userLoggedIn);
                        expect(status).to.equal(success);
                        expect(data).to.have.property('user');
                        expect(data.user.id).to.equal(1);
                        expect(data.user.firstName).to.equal('testFirstName');
                        expect(data.user.lastName).to.equal('testLastName');
                        expect(data.user.userName).to.equal('testUserName');
                        expect(data.user.email).to.equal('test@email.com');
                        expect(data.user.role).to.equal('user');
                        expect(data).to.have.property('token');
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('It Should not sigin users with non existing  username signin details', (done) => {
            factory.app
                .post(`${signinUrl}`)
                .send({
                    userNameOrEmail: 'testNonUserName',
                    password: 'testPassword'
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status } = res.body;
                        expect(res).to.have.status(401);
                        expect(message).to.equal(incorrectCredentials);
                        expect(status).to.equal(fail);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('It Should not sigin users with non existing  email signin details', (done) => {
            factory.app
                .post(`${signinUrl}`)
                .send({
                    userNameOrEmail: 'nonuser@email.com',
                    password: 'testPassword'
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status } = res.body;
                        expect(res).to.have.status(401);
                        expect(message).to.equal(incorrectCredentials);
                        expect(status).to.equal(fail);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        });
        it('It Should not sigin users with non existing password signin details', (done) => {
            factory.app
                .post(`${signinUrl}`)
                .send({
                    userNameOrEmail: 'test@email.com',
                    password: 'nonTestPassword'
                })
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        const { message, status } = res.body;
                        expect(res).to.have.status(401);
                        expect(message).to.equal(incorrectCredentials);
                        expect(status).to.equal(fail);
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
        })

    });

});
