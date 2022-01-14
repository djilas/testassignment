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
}
export default commonMethods
