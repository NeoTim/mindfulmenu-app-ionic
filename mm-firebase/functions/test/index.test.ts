import * as sinon from 'sinon';
import { assert, expect } from 'chai';
import 'mocha';
import * as admin from 'firebase-admin';
const test = require('firebase-functions-test')();

// Mock config values, if needed
test.mockConfig({ gmail: { email: 'ourmindfulmenu@gmail.com', password: 'fithappens' } });

describe('Cloud Functions', () => {
    let myFunctions, adminInitStub;

    before(() => {
        adminInitStub = sinon.stub(admin, 'initializeApp');
        // TODO Can't get this to work...
        sinon.stub(admin, 'firestore')
            .get(function () {
                return function () {
                    return "data";
                }
            });
        myFunctions = require('../lib/index');
    });

    after(() => {
        adminInitStub.restore();
        // Do other cleanup tasks.
        test.cleanup();
    });

    describe('testEmail', () => {

        it('should send a welcome email to an address', (done) => {
            const req = { query: { email: 'jared@chanlhealth.com', name: 'Jared' } };
            const res = {
                redirect: (code, url) => {
                    assert.equal(code, 200);
                    done();
                }
            };

            myFunctions.testEmail(req, res);
        })
    });
})