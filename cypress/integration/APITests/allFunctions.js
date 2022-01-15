class commonMethods{

    generateRandomEmail(length) {

        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
    
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        console.log(str);
        return str + '@gmail.com';
    }

    getRandomUserStatus(){

        const status = ["active", "inactive"];

        let randomIndex = Math.floor(Math.random() * status.length); 
        let randomElement = status[randomIndex];

        return randomElement
    }

    randomNumberOfPage(max) { 
        let min = 1;
        return Math.floor(Math.random() * (max - min) + min);
    } 

}
export default commonMethods
