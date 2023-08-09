export default class userRespository {
    constructor(dao, model) {
        this.dao = dao
        this.model = model
    }

    getUser = async(params) => {
        return this.dao.get(params, this.model)
    }

    saveUser = async(data) => {
        return this.dao.post(data, this.model)
    }

    updateUser = async(id,updates)=>{
        const user = await this.dao.get({_id:id},this.model)

        if(user != ''){
            await this.dao.update({_id:id}, {...updates},this.model)
            return true
        }

        return false
    }
}