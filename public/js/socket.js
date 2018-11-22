
(function(){
    function format(unix_timestamp) {
      var date = new Date(unix_timestamp*1000);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }
    let socket = io();
    console.log('Start chat!')
    let $form = document.getElementById('form_mess')
    let $mesage = document.getElementById('message')
    let $chat = document.getElementById('messages')
    let $btn_sbm = document.getElementById('btn_sbm')

    $form.addEventListener('submit', (e) => {
      socket.emit('fantasy:live', {type: 'message', timestamp: Date.now(), msg: $mesage.value})
      $mesage.value = ''
      e.stopPropagation()
      e.preventDefault()
      return e
    })
    socket.on('fantasy!:live', function(msg){
      const typeMsg = msg.type || 'msg'
      let $li = document.createElement('LI')
      const textnode = document.createTextNode(msg.msg || '')
      const $time = document.createElement('SPAN')
      const textnodetime = document.createTextNode(format(msg.timestamp))
      const $type = document.createElement('SPAN')
      $li.classList.add(typeMsg)
      $time.appendChild(textnodetime)
      $time.classList.add('time')
      $li.appendChild($time)
      $li.appendChild(textnode);
      $chat.appendChild($li)
      window.scrollTo(0, document.body.scrollHeight);
    })
})()
