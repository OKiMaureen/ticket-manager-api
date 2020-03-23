import chaiHttp from 'chai-http';
import chai from 'chai';
import TestFactory from '../factory';
import MockUser from '../src/mockData/user';
import { fail, notAuthenticated, invalidToken } from '../src/utils/messages';

const { expect } = chai;
chai.use(chaiHttp);
const adminStoryUrl = '/api/v1/stories/admin';
const signupUrl = '/api/v1/auth/signup';

let adminToken: string;
let userToken: string;


describe('Test Admin Story', () => {

  const factory: TestFactory = new TestFactory()
  const admin: MockUser = MockUser.correctAdminDetails();
  const user: MockUser = MockUser.correctUserDetails();

  before(async () => {
    await factory.init();
  })
  after(async () => {
    await factory.close();
  })
  before((done) => {
    factory.app
      .post(`${signupUrl}`)
      .send(admin)
      .end((err, res) => {
        adminToken = res.body.data.token;
        done();
      });
  });
  before((done) => {
    factory.app
      .post(`${signupUrl}`)
      .send(user)
      .end((err, res) => {
        userToken = res.body.data.token;
        done();
      });
  });

  describe('GET /api/v1/stories/admin', () => {
    it('should not authenticate non admin', (done) => {
      factory.app
        .get(`${adminStoryUrl}`)
        .set('token', userToken)
        .end((err, res) => {
          try {
            if (err) throw err;
            const { message, status } = res.body;
            expect(res).to.have.status(403);
            expect(message).to.equal(notAuthenticated);
            expect(status).to.equal(fail);
            return done();
          } catch (err) {
            return done(err);
          }
        });
    });
    it('should not authenticate when token is not provided', (done) => {
      factory.app
        .get(`${adminStoryUrl}`)
        .end((err, res) => {
          try {
            if (err) throw err;
            const { message, status } = res.body;
            expect(res).to.have.status(401);
            expect(message).to.equal(invalidToken);
            expect(status).to.equal(fail);
            return done();
          } catch (err) {
            return done(err);
          }
        });
    });

  });
});



