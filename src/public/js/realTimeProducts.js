const socket = io()

socket.on('products', (data)=>{

    const list = document.querySelector('#list')
    list.innerHTML = ''
    data.forEach(element => {
        list.innerHTML += `<div class="bg-white drop-shadow-xl my-3 w-[330px] h-[500px] flex flex-col rounded-[20px] ">
            <img src="${element.thumbnails[1]}" class="h-3/5 rounded-b-[50px] rounded-t-[20px] border-2" alt="">
            <div class="h-2/5 p-5 flex flex-col gap-2 text-center">
                <h2 class="font-bold">${element.title}</h2>
                <p>${element.description}</p>
                <div class="flex text-center gap-1 mb-2">
                    <p class="w-2/4 p-1 bg-rose-200 rounded-[50px] drop-shadow-md">Code: ${element.code}</p>
                    <p class="w-2/4 p-1 bg-rose-200 rounded-[50px] drop-shadow-md">Price: $${element.price}</p>
                </div>
                <div class="flex text-center gap-1">
                    <p class="w-2/4 p-1 bg-rose-200 rounded-[50px] drop-shadow-md">Stock: ${element.stock}</p>
                    <p class="w-2/4 p-1 bg-rose-200 rounded-[50px] drop-shadow-md">Category: ${element.category}</p>
                </div>
            </div>
        </div>`
    });

})