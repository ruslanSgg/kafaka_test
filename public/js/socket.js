
(function(){
    let socket = io();
    console.log('Start chat!')
    let $form = document.getElementById('form_mess')
    let $mesage = document.getElementById('message')
    let $chat = document.getElementById('messages')
    let $btn_sbm = document.getElementById('btn_sbm')

    $form.addEventListener('submit', (e) => {
      console.log('message: ', $mesage.value)
      socket.emit('message', $mesage.value)
      $mesage.value = ''
      e.stopPropagation()
      e.preventDefault()
      return e
    })
    socket.on('message', function(msg){
      const $li = document.createElement('LI')
      const textnode = document.createTextNode(msg)
      $li.appendChild(textnode);
      $chat.appendChild($li)
      window.scrollTo(0, document.body.scrollHeight);
    })
})()
