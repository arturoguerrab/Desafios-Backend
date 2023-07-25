const socket = io()

socket.on('messages', (data)=>{

    const list = document.querySelector('#messages')
    list.innerHTML = ''
    data.forEach(element => {
        list.innerHTML += ` <hr/>
        <h2>user: ${element.user}</h2>
        <p><strong>mensaje</strong>: ${element.message}</p>
        <hr/>
        `
    });

})