export default class userPasswordRespository {
    constructor(dao, model) {
        this.dao = dao
        this.model = model
    }

    getUserPassword = async(params) => {
        return this.dao.get(params, this.model)
    }

    saveUserPassword = async(data) => {
        return this.dao.post(data, this.model)
    }

    updateUserPassword = async(id,updates)=>{
        const user = await this.dao.get({_id:id},this.model)

        if(user != ''){
            await this.dao.update({_id:id}, {...updates},this.model)
            return true
        }

        return false
    }

    deleteUserPassword = async(condicion) =>{

        const product = await this.dao.get(condicion,this.model)

        if(product != ''){

            await this.dao.delete(condicion,this.model)  
            return true  
        }
        return false
    }
}