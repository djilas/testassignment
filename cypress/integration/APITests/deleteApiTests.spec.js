/// <reference types="Cypress"/>

import commonMethods from './allFunctions';

const dataForUser = require('../../fixtures/createuser.json');

/**
 * What to do first: We will first create a new user
 * Why: Delete method requires a user ID
 * We can get any id from the GET respons but considering that a lot of people probably work on this open API endpoints I'll create a new user and then delete it
 */

/** */

context('Delete Api Tests', () => {

    const func = new commonMethods();
    let accessToken;
    let invalidToken;
    let email = func.generateRandomEmail(8);
    let idOfUserForDeleting = 1768;
    let invalidUserId = 525252662;

    before(function () {

        cy.fixture('example').then(function (data){
            accessToken = data.token;
            invalidToken = data.wrongToken;
        })
    })

    it('Delete user test (first create)', function () {
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
            //get the id of user
            let userId = response.body.data.id;
            console.log(userId);

            //Delete user
            cy.request({
                method: 'DELETE',
                url: `/users/${userId}`,
                headers: {
                    'authorization' : 'Bearer ' + accessToken
                }
            }).then((response) => {
                expect(response.status).to.eq(204);
            })
        })
    })

    it('Delete user with invalid id', function () {
        
        cy.request({
            method: 'DELETE',
            url: `/users/${invalidUserId}`,
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            failOnStatusCode : false
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.data.message).to.eq('Resource not found');
        })
    })

    it('Delete user with invalid token', function () {
        
        cy.request({
            method: 'DELETE',
            url: `/users/${idOfUserForDeleting}`,
            headers: {
                'authorization' : 'Bearer ' + invalidToken
            },
            failOnStatusCode : false
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.data.message).to.eq('Authentication failed');
        })
    })

    //Deleting the user without creating it frist [WILL FAIL]
    it('Delete user test', function () {
        
        cy.request({
            method: 'DELETE',
            url: `/users/${userId}`,
            headers: {
                'authorization' : 'Bearer ' + accessToken
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.message).to.eq('Authentication failed');
        })
    })
})

const tokens = require('../../fixtures/example.json')

context('Delete user with before or beforeEach method', () => {

    const func = new commonMethods();
    let accessToken = tokens.token;
    let email = func.generateRandomEmail(8);

    before(function () {
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
            userId = response.body.data.id;
            numberOfPages = response.body.meta.pagination.pages;
            console.log(userId);
        })
    })

    it('Delete user test', function () {
        
        cy.request({
            method: 'DELETE',
            url: `/users/${userId}`,
            headers: {
                'authorization' : 'Bearer ' + accessToken
            }
        }).then((response) => {
            expect(response.status).to.eq(204);
        })
    })

})