export default class messagesRespository {
    constructor(dao, model) {
        this.dao = dao
        this.model = model
    }

    newMessage = async (message) => {

        this.dao.post({user:message.user, message:message.messages}, this.model)
        return true
    }

    getHistorial = async()=>{
        const getAll = await this.dao.get({}, this.model)
        if(getAll != '') return getAll
        return false
    }
}