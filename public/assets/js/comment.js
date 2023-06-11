var commentForm = $(".create-comment");

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
      id="delete-comment-${_id}"
      href="/user/destroy-comment/${_id}"
      >X</a>
    <div>${content}</div>
    <div>${name}</div>
  </div>
  `;
}

commentForm.each(function () {
  $(this).on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/user/create-comment",
      data: $(this).serialize(),
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
});

const comments = $(".delete-comments");

comments.each(function () {
  let comment = $(this);
  let _id = comment.attr("id");
  $(this).on("click", function (e) {
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
});
