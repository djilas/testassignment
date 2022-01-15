/// <reference types="Cypress"/>

const dataForUser = require('../../fixtures/createuser.json') // <- Instead of this we can use cy.fixture('createuser;).then((userData))
const tokens = require('../../fixtures/example.json')
import commonMethods from './allFunctions';

context('GET API tests', () => {

    let userId; // for storing new user's id
    let numberOfPages; // store number of pages

    const func = new commonMethods();
    let accessToken = tokens.token;
    let userStatus = func.getRandomUserStatus(); 
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
            console.log(userId);
        })
    })

    it('Get the first page of users test', () =>{

        cy.request({
            method: 'GET',
            url: '/users/',
            headers: {
                'authorization' : 'Bearer ' + accessToken
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.not.be.null;
            expect(response.body.meta.pagination.limit).to.eq(20);
            expect(response.body.data).to.be.length(20);

            numberOfPages = response.body.meta.pagination.pages;
        })
    })

    it(`Get a user by id test`, () => {

        cy.request({
            method: 'GET',
            url: `/users/${userId}`,
            headers: {
                'authorization' : 'Bearer ' + accessToken
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.not.be.null;
            expect(response.body.data.id).to.eq(userId);
        })
    })

    it(`Try to get user that doesn't exists`, () => {

        cy.request({
            method: 'GET',
            url: `/users/3`,
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            failOnStatusCode : false
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.not.be.null;
            expect(response.body.data.message).to.eq('Resource not found');
        })
    })

    it(`Get a page`, () => {

        let webPage = func.randomNumberOfPage(numberOfPages);
        
        cy.request({
            method: 'GET',
            url: '/users/',
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            qs : {
                page: `${webPage}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.not.be.null;
            expect(response.body.meta.pagination.page).to.eq(webPage);

            if(webPage == 1){
                expect(response.body.meta.pagination.links.previous).to.be.null;
                expect(response.body.meta.pagination.links.next).to.include(`/users?page=${webPage+1}`);   
            }else {
                expect(response.body.meta.pagination.links.previous).to.include(`/users?page=${webPage-1}`);
                expect(response.body.meta.pagination.links.next).to.include(`/users?page=${webPage+1}`);
            }
        })
    })

    it(`Get a users by ${userStatus} status `, () => {
        console.log(userStatus)
        cy.request({
            method: 'GET',
            url: '/users/',
            headers: {
                'authorization' : 'Bearer ' + accessToken
            },
            qs : {
                status: `${userStatus}`
            }
        }).then((response) => {

            for(let i = 0; i < response.body.meta.pagination.limit; i++){
                expect(response.body.data[i].status).to.eq(userStatus);
            }    
        })
    })
})