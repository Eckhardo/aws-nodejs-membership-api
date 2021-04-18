require('dotenv').config();
const createUser= require('../../../../api/user/create');
const eventGenerator = require('../../testUtils/eventGenerator');
const userCreateBody= require('../../../testdata/clidata/user/invokePostUser.json');
describe( "Create User integration test", () => {
    test('It should take a body and should return an Api Gateway Response', async () => {
        const event= {"body":{"item":{"user_name":"Eckhardo","first_name":"Bernhard","last_name":"Kirschning","password":"abc","email":"eki@freenet.de","zip":20255,"city":"Hamburg","address":"Lutterothstrasse 88","phone":"+4916097023201","mobil":"+4916097023201","admission_year":"2011","is_admin":false,"is_active":true}}};

        const resp = await  createUser.handler(event);

        console.log(JSON.stringify(resp));
    })

})
