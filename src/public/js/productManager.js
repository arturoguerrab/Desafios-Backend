


const deleteProduct = async(event) => {
    event.preventDefault()
    const productId = document.querySelector('#producto')

    const contenedor = document.querySelector('#contenedor')
    
    
    const response = await fetch(`http://localhost:8080/api/products/${productId.value}`, {method: 'DELETE'})
    .then(res=>res.json())
    .then(res=> contenedor.innerHTML=`<p>${res.message}</p>`)

}
const element = document.querySelector('#submit')
element.onclick = deleteProduct