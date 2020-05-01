$(function() {
  function buildHTML(message) {
    if ( message.image ) {
      var html = `<div class="message-list" data-message-id=${message.id}>
                    <div class="message-list__box">
                      <div class="message-list__box__info">
                        <div class="message-list__box__info__user">
                          ${message.user_name}
                        </div>
                        <div class="message-list__box__info__date">
                          ${message.created_at}
                        </div>
                      </div>
                      <div class="message-list__box__text">
                        <p class="message-list__box__text__content">
                          ${message.content}
                        </p>
                      </div>
                      <img src=${message.image} >
                    </div>
                  </div>`
      return html;
    } else {
      var html = `<div class="message-list" data-message-id=${message.id}>
                    <div class="message-list__box">
                      <div class="message-list__box__info">
                        <div class="message-list__box__info__user">
                          ${message.user_name}
                        </div>
                        <div class="message-list__box__info__date">
                          ${message.created_at}
                        </div>
                      </div>
                      <div class="message-list__box__text">
                        <p class="message-list__box__text__content">
                          ${message.content}
                        </p>
                      </div>
                    </div>
                  </div>`
      return html;
    }
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
      .done(function(data){
        var html = buildHTML(data);
        $('.chat-main__message-list').append(html);
        $('form')[0].reset();
        $('input').prop('disabled', false);
        $('.chat-main__message-list').animate({scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      })
      .fail(function() {
        alert("メッセージ送信に失敗しました");
      })
      .always(function() {
      $('input').prop('disabled', false);
      });
  });

  var reloadMessages = function() {
    var last_message_id = $('.message-list:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message);
        });
        $('.chat-main__message-list').append(insertHTML);
        $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
})