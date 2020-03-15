import chaiHttp from 'chai-http';
import chai from 'chai';
import Server from '../src/config/server';


const { expect } = chai;
chai.use(chaiHttp);
describe('Test default route', () => {
  let App = new Server().app
  it('Should return 200 for the default route', (done) => {
    chai.request(App)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Welcome to ticket manager API');
        done();
      });
  });
});