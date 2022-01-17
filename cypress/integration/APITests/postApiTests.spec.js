/// <reference types="Cypress"/>

import commonMethods from './allFunctions';

const dataForUser = require('../../fixtures/createuser.json') // <- Instead of this we can use cy.fixture('createuser;).then((userData))

context('Post Api Tests', () => {

    const func = new commonMethods();
    let accessToken;
    let wrongAccessToken;

    //random email for creating usre
    let email = func.generateRandomEmail(8);
    let invalidEmail = 'testgmail.com';

    before(function () {
        cy.fixture('example').then(function (data){
            accessToken = data.token;
            wrongAccessToken = data.wrongToken;
        })
    })

    it('Creat user test', function () {
        cy.request({
            method: 'POST',
            url : '/users/',
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            body : {
                'name' : dataForUser.forCreating.name,
                'gender': dataForUser.forCreating.gender,
                'email' : email,
                'status' : dataForUser.forCreating.status
            }
        }).then((response) => { 
            cy.log(JSON.stringify(response));

            expect(response.status).to.eq(201);

            expect(response.body.data).has.property('email', email);
            expect(response.body.data).has.property('name', dataForUser.forCreating.name);
            expect(response.body.data).has.property('gender', dataForUser.forCreating.gender);
            expect(response.body.data).has.property('status', dataForUser.forCreating.status);
        })
    })

    it('Create user with already existing email test', function () {
        cy.request({
            method: 'POST',
            url : '/users/',
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            body : {
                'name' : dataForUser.forCreating.name,
                'gender': dataForUser.forCreating.gender,
                'email' : email,
                'status' : dataForUser.forCreating.status
            },
            failOnStatusCode : false
        }).then((response) => { 
            expect(response.status).to.eq(422);
            expect(response.body.data[0].field).to.eq('email');
            expect(response.body.data[0].message).to.eq('has already been taken');
        })
    })

    it('Create user with invalid email test', function () {
        cy.request({
            method: 'POST',
            url : '/users/',
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            body : {
                'name' : dataForUser.forCreating.name,
                'gender': dataForUser.forCreating.gender,
                'email' : invalidEmail,
                'status' : dataForUser.forCreating.status
            },
            failOnStatusCode : false
        }).then((response) => { 
            expect(response.status).to.eq(422);
            expect(response.body.data[0].field).to.eq('email');
            expect(response.body.data[0].message).to.eq('is invalid');
        })
    })

    it('Creat user with wrong authorization token test', function () {
        cy.request({
            method: 'POST',
            url : '/users/',
            headers: {
                'authorization' : 'Bearer ' + wrongAccessToken
            },
            body : {
                'name' : dataForUser.forCreating.name,
                'gender': dataForUser.forCreating.gender,
                'email' : email,
                'status' : dataForUser.forCreating.status
            },
            failOnStatusCode : false
        }).then((response) => { 
            expect(response.status).to.eq(401);
            expect(response.body.data.message).to.eq('Authentication failed');
        })
    })

    it('Sending blank body for creating user request test', function () {
        cy.request({
            method: 'POST',
            url : '/users/',
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            body : {
                'name' : "",
                'gender': "",
                'email' : "",
                'status' : ""
            },
            failOnStatusCode : false
        }).then((response) => { 
            expect(response.status).to.eq(422);
            expect(response.body.data[0].field).to.eq('email');
            expect(response.body.data[0].message).to.eq("can't be blank");
            expect(response.body.data[1].field).to.eq('name');
            expect(response.body.data[1].message).to.eq("can't be blank");
            expect(response.body.data[2].field).to.eq('gender');
            expect(response.body.data[2].message).to.eq("can't be blank");
            expect(response.body.data[3].field).to.eq('status');
            expect(response.body.data[3].message).to.eq("can't be blank");
        })
    })
})

/**
 * The idea is to check the user in DB after we successfully have created a new user
 */
 context('POST and GET chaining Api Tests', () => {

    const func = new commonMethods();
    let accessToken;

    let email = func.generateRandomEmail(8);

    before(function () {

        cy.fixture('example').then(function (data){
            accessToken = data.token
        })
    })

    it('Creat user test test', function () {
        cy.request({
            method: 'POST',
            url : '/users/',
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            body : {
                'name' : dataForUser.forCreating.name,
                'gender': dataForUser.forCreating.gender,
                'email' : email,
                'status' : dataForUser.forCreating.status
            }
        }).then((response) => { 
            cy.log(JSON.stringify(response));

            expect(response.status).to.eq(201);

            expect(response.body.data).has.property('email', email);
            expect(response.body.data).has.property('name', dataForUser.forCreating.name);
            expect(response.body.data).has.property('gender', dataForUser.forCreating.gender);
            expect(response.body.data).has.property('status', dataForUser.forCreating.status);
        }).then((response) => {
            const userId = response.body.data.id;
            console.log(userId);

            //Let's make sure that the user can be get 
            cy.request({
                method: 'GET',
                url: `/users/${userId}`,
                headers: {
                    'authorization' : 'Bearer ' + accessToken
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.data).has.property('email', email);
                expect(response.body.data).has.property('name', dataForUser.forCreating.name);
                expect(response.body.data).has.property('gender', dataForUser.forCreating.gender);
                expect(response.body.data).has.property('status', dataForUser.forCreating.status);
            })
        })
    })
})