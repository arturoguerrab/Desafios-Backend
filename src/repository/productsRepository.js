export default class productsRespository {
    constructor(dao, model) {
        this.dao = dao
        this.model = model
    }

    getProducts = async(params) => {

        const getAll = await this.dao.get(params,this.model)
        if(getAll != '') return getAll
        return false
    }
    
    getProductsPaginate = async(params) => {
        
        let {limit,sort,page,lean=false,query} = params
        
        let getAll = await this.dao.getPaginate({},{limit,page,lean:lean},this.model)
        
        if(getAll != '' && lean==false){
            
            if(sort==='asc' && query==''){
                return getAll = await this.dao.getPaginate({},{limit,page, sort:{price:'asc'}},this.model)
            }
            if(sort==='desc' && query==''){
                return getAll = await this.dao.getPaginate({},{limit,page, sort:{price:'desc'}},this.model)
            }
            
            if(query!='' ){
                if(sort==='asc'){
                    return getAll = await this.dao.getPaginate({category: `${query}`},{limit,page, sort:{price:'asc'}},this.model)
                }
                if(sort==='desc'){
                    return getAll = await this.dao.getPaginate({category: `${query}`},{limit,page, sort:{price:'desc'}},this.model)
                }
                return getAll = await this.dao.getPaginate({category: `${query}`},{limit,page},this.model)
            }
            return getAll
        }
        return getAll
    }

    addProduct = async (product) => {

        const products = await this.dao.get({code:product.code},this.model)

        if(products!='') return false

        await this.dao.post(product,this.model) 
        return true
    }

    updateProduct = async (id,updates)=>{
        

        const product = await this.dao.get({_id:id},this.model)

        if(product != ''){
            await this.dao.update({_id:id}, {...updates},this.model)
            return true
        }

        return false
    }

    deleteProduct = async(id) =>{

        const product = await this.dao.get({_id:id},this.model)

        if(product != ''){

            await this.dao.delete({_id:id},this.model)  
            return true  
        }
        return false
    }

}