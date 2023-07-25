export default class UserDTO{
    constructor(user){
        this.first_name = user.first_name
        this.username = user.email
        this.rol= user.rol
    }
}