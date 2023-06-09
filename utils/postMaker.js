const postMaker = (postData) => {
  const {
    content,
    user: { name = "", _id: userId } = "",
    _id: postId,
  } = postData;
  return `<p>
    <a href="/user/destroy-post/${postId}">X</a>
    <h3>${name}</h3>
    <h4>${content}</h4>
    <div>
      <form action="/user/create-comment" method="post">
        <textarea name="post_comment" cols="10" rows="1"></textarea>
        <input name="post_id" value="${postId}" hidden />
        <button type="submit">Add Comment</button>
      </form>
      <div>
      </div>
    </div>
  </p>`;
};
