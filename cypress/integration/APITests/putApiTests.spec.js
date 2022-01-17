/// <reference types="Cypress"/>

import commonMethods from './allFunctions';

const dataForUser = require('../../fixtures/createuser.json');
const tokens = require('../../fixtures/example.json')

context('Put Api tests', () => {

    const func = new commonMethods();
    let accessToken = tokens.token;
    let wrongAccessToken = tokens.wrongToken;

    let email = func.generateRandomEmail(8);

    let existingEmail;
    let userId;
    let userIdForExistingEmail;

    beforeEach(function () {
        cy.request({
            method: 'POST',
            url : '/users/',
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            body : {
                'name' : dataForUser.forCreating.name,
                'gender': dataForUser.forCreating.gender,
                'email' : func.generateRandomEmail(8),
                'status' : dataForUser.forCreating.status
            }
        }).then((response) => { 
            userId = response.body.data.id;
            userIdForExistingEmail = response.body.data.email;
            console.log(userId);
            console.log(userIdForExistingEmail);
        })

        cy.request({
            method: 'GET',
            url: '/users/',
            headers: {
                'authorization' : 'Bearer ' + accessToken
            }
        }).then((response) => {
            existingEmail = response.body.data[1].email;
        })
    })

    it('Update user test', () => {
        cy.request({
            method: 'PUT',
            url : `/users/${userId}`,
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            body : {
                'name' : dataForUser.forUpdating.name,
                'gender': dataForUser.forUpdating.gender,
                'email' : email,
                'status' : dataForUser.forUpdating.status
            },
        }).then((response) => {   

            expect(response.status).to.eq(200);

            expect(response.body.data).has.property('email', email);
            expect(response.body.data).has.property('name', dataForUser.forUpdating.name);
            expect(response.body.data).has.property('gender', dataForUser.forUpdating.gender);
            expect(response.body.data).has.property('status', dataForUser.forUpdating.status);
        })
    })

    it('Update user test with the existing email', () => {
        cy.request({
            method: 'PUT',
            url : `/users/${userId}`,
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            body : {
                'name' : dataForUser.forUpdatingname,
                'gender': dataForUser.forUpdating.gender,
                'email' : existingEmail,
                'status' : dataForUser.forUpdating.status
            },
            failOnStatusCode : false
        }).then((response) => {   
            expect(response.status).to.eq(422);

            expect(response.body.data[0].field).to.eq('email');
            expect(response.body.data[0].message).to.eq('has already been taken')
        })
    })

    it('Update user with wrong authorization token', () => {
        cy.request({
            method: 'PUT',
            url : `/users/${userId}`,
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

    it('Update user with empty body', () => {
        cy.request({
            method: 'PUT',
            url : `/users/${userId}`,
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            body : {
            },
            failOnStatusCode : false
        }).then((response) => { 
            expect(response.status).to.eq(400);
        })
    })
})

context('POST, PUT, GET chaining Api Tests', () => {

    const func = new commonMethods();
    let accessToken;

    let email = func.generateRandomEmail(6);

    let userId;

    before(function () {

        cy.fixture('example').then(function (data){
            accessToken = data.token
        })
    })
    //Create user
    it('Creat user test', () => {
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
            //find that user
            userId = response.body.data.id;
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
        }).then((response) => {
            cy.request({
                method: 'PUT',
                url : `/users/${userId}`,
                headers: {
                    'authorization' : 'Bearer ' + accessToken
                },
                body : {
                    'name' : dataForUser.forUpdating.name,
                    'gender': dataForUser.forUpdating.gender,
                    'email' : email,
                    'status' : dataForUser.forUpdating.status
                },
            }).then((response) => {   
    
                expect(response.status).to.eq(200);
    
                expect(response.body.data).has.property('email', email);
                expect(response.body.data).has.property('name', dataForUser.forUpdating.name);
                expect(response.body.data).has.property('gender', dataForUser.forUpdating.gender);
                expect(response.body.data).has.property('status', dataForUser.forUpdating.status);
            }).then((response) => {
                //Let's make sure that the user is updated
                cy.request({
                    method: 'GET',
                    url: `/users/${userId}`,
                    headers: {
                        'authorization' : 'Bearer ' + accessToken
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.data).has.property('email', email);
                    expect(response.body.data).has.property('name', dataForUser.forUpdating.name);
                    expect(response.body.data).has.property('gender', dataForUser.forUpdating.gender);
                    expect(response.body.data).has.property('status', dataForUser.forUpdating.status);
                })
            })
        })
    })
})