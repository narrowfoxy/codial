var socialPostForm = $("#post_form");

socialPostForm.submit((e) => {
  e.preventDefault();
  const formData = socialPostForm.serialize();
  $.ajax({
    type: "POST",
    url: "/user/create-post",
    data: formData,
    success: function (response) {
      socialPostForm.append(`${postMaker(response)}`);
      const {
        data: { _id: postId },
      } = response;

      const deletePost = $(`#destroy-post-${postId}`);

      deletePost.on("click", function (e) {
        e.preventDefault();
        $.ajax({
          type: "GET",
          url: `/user/destroy-post/${postId}`,
          success: function (response) {
            $(`#post-container-${postId}`).remove();
            const { success } = response;
            if (success) {
              new Noty({
                theme: "relax",
                text: `${success}`,
                type: "success",
                layout: "topRight",
                timeout: 1500,
              }).show();
            }
          },
        });
      });

      const commentElement = $(`#comment-form-${postId}`);

      commentElement.on("submit", function (e) {
        e.preventDefault();
        $.ajax({
          type: "POST",
          url: "/user/create-comment",
          data: $(commentElement).serialize(),
          success: function (response) {
            const {
              comment: { post, _id },
            } = response;
            const commentContainer = $(`#comment-container-${post}`);
            commentContainer.prepend(commentMaker(response));
            const commentElement = $(`#delete-comment-${_id}`);

            commentElement.on("click", function (e) {
              e.preventDefault();
              $.ajax({
                type: "GET",
                url: `/user/destroy-comment/${_id}`,
                success: function (response) {
                  $(`#comment-container-${_id}`).remove();
                  const { success } = response;
                  if (success) {
                    new Noty({
                      theme: "relax",
                      text: `${success}`,
                      type: "success",
                      layout: "topRight",
                      timeout: 1500,
                    }).show();
                  }
                },
              });
            });
          },
        });
      });
    },
  });
});

function commentMaker({ comment, success }) {
  const {
    content,
    user: { name },
    _id,
  } = comment;

  if (success) {
    new Noty({
      theme: "relax",
      text: `${success}`,
      type: "success",
      layout: "topRight",
      timeout: 1500,
    }).show();
  }

  return `<div id="comment-container-${_id}" ><a
      href="/user/destroy-comment/${_id}"
      >X</a>
    <div>${content}</div>
    <div>${name}</div>
  </div>
  `;
}

function postMaker({ data: postData, success }) {
  const {
    content,
    user: { name = "", _id: userId = "" } = "",
    _id: postId,
  } = postData;
  if (success) {
    new Noty({
      theme: "relax",
      text: `${success}`,
      type: "success",
      layout: "topRight",
      timeout: 1500,
    }).show();
  }
  return `<p id="post-container-${postId}">
        <a id="destroy-post-${postId}" href="/user/destroy-post/${postId}">X</a>
        <h3>${name}</h3>
        <h4>${content}</h4>
        <div>
          <form id="comment-form-${postId}" class="create-comment" action="/user/create-comment" method="post">
            <textarea name="post_comment" cols="10" rows="1"></textarea>
            <input name="post_id" value="${postId}" hidden />
            <button type="submit">Add Comment</button>
          </form>
          <div id="comment-container-${postId}">
          </div>
        </div>
      </p>`;
}

const deletePost = $('a[href^="/user/destroy-post"]');

deletePost.each(function () {
  const post = $(this);
  const postId = post.attr("id");
  post.on("click", function (e) {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: `/user/destroy-post/${postId}`,
      success: function (response) {
        $(`#post-container-${postId}`).remove();
        const { success } = response;
        if (success) {
          new Noty({
            theme: "relax",
            text: `${success}`,
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        }
      },
    });
  });
});
