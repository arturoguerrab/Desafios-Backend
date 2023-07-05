import productsModel from "../Models/products.model.js";


class ProductManager{

    addProduct = async (product) => {

        
        
        const products = await productsModel.exists({code:product.code}).lean().exec()

        if(products!=null){
            
            return false
        }

        const getAll = await productsModel.find().lean().exec()

        if(getAll==''){
            const id = 1
            const newProduct = new productsModel({id:id,...product})
            await newProduct.save()
            
            return true
        }

        let count = await productsModel.countDocuments()
        let itemID=""

        do {
            count++
            itemID = await productsModel.exists({id:count}).lean().exec()
        } while ( itemID != null);
        
        const newProduct = new productsModel({id:count,...product})
        await newProduct.save()
        
        return true
    }

    getProducts = async() => {
        

        const getAll = await productsModel.find().lean().exec()

        if(getAll != ''){
            
            return getAll
        }

        
        return false
    }

    getProductsQuerys = async(limit,sort,page,query) => {
        

        let getAll = await productsModel.paginate({},{limit,page})
        
        if(getAll != ''){
        
            if(sort==='asc' && query==''){
                getAll = await productsModel.paginate({},{limit,page, sort:{price:'asc'}})
            }
            if(sort==='desc' && query==''){
                getAll = await productsModel.paginate({},{limit,page, sort:{price:'desc'}})
            }
            
            if(query!=''){
                getAll = await productsModel.paginate({category: `${query}`},{limit,page})

                if(sort==='asc'){
                    getAll = await productsModel.paginate({category: `${query}`},{limit,page, sort:{price:'asc'}})
                }
                if(sort==='desc'){
                    getAll = await productsModel.paginate({category: `${query}`},{limit,page, sort:{price:'desc'}})
                }

                
                return getAll
            }

            
            return getAll
        }

        
        return false
    }

    getProductById = async(id)=> {

        

        const getAll = await productsModel.find().lean().exec()

        if(getAll != ''){

            const ProductById = await productsModel.find({id:id}).lean().exec()

            if(ProductById ==''){
                
                return false
            }

            
            return ProductById
        }

        
        return false
    }
    
    updateProduct = async (id,updates)=>{
        

        const findById = await productsModel.find({id:id}).lean().exec()

        if(findById != ''){

            await productsModel.findOneAndUpdate({id:id}, {...updates})
            
            return true
        }

        
        return false
    }


    deleteProduct = async(id) =>{

        

        const getAll = await productsModel.find({id:id}).lean().exec()

        if(getAll != ''){

            await productsModel.findOneAndDelete({id:id})
            
            return true
            
        }

        
        return false
    }
    
}
const Manager = new ProductManager()

export default Manager