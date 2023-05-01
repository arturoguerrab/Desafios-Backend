const socket = io()

socket.on('products', (data)=>{

    const list = document.querySelector('#list')
    list.innerHTML = ''
    data.forEach(element => {
        list.innerHTML += `<h2>Title: ${element.title}</h2>
        <p><strong>Description</strong>: ${element.description}</p>
        <p><strong>Code</strong>: ${element.code}</p>
        <p><strong>Price</strong>: $${element.price}</p>
        <p><strong>Stock</strong>: ${element.stock}</p>
        <p><strong>Category</strong>: ${element.category}</p>
        <hr>`
    });

})