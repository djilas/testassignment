/// <reference types="Cypress"/>

context('GET API tests', () => {

    let accessToken;
    let webPage = 2;
    let userId = 1755;
    let userStatus = 'active';

    before(function () {

        cy.fixture('example').then(function (data){
            accessToken = data.token
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
        })
    })

    it(`Get a user by id ${userId} test`, () => {

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

    it(`Get a ${webPage} page `, () => {

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
})