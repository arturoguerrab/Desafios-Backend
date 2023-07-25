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
}