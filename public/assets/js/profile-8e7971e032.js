const profileUpdate = $("#update-profile");
profileUpdate.on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  $.ajax({
    type: "POST",
    url: "/user/update-profile",
    data: formData,
    enctype: "multipart/form-data",
    processData: false,
    contentType: false,
    success: function (response) {
      const { data: { name = "", avatar = "" } = {}, success } = response;
      $("#profile-name").html(name);
      $("#profile-image").remove();
      $("#profile-image-container").html(
        `<img id="profile-image" height="100px" width="100px" src="${avatar}" alt="${name}" />`
      );
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
