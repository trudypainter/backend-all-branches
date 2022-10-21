// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById("response");
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add("flashing");
  setTimeout(() => {
    preParent.classList.remove("flashing");
  }, 300);
}

function showResponse(response) {
  response.json().then((data) => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText,
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  "create-user": createUser,
  "delete-user": deleteUser,
  "change-username": changeUsername,
  "change-password": changePassword,
  "sign-in": signIn,
  "sign-out": signOut,

  "view-all-freets": viewAllFreets,
  "view-freets-by-author": viewFreetsByAuthor,
  "create-freet": createFreet,
  "edit-freet": editFreet,
  "delete-freet": deleteFreet,

  "create-channel": createChannel,
  "edit-channel": editChannel,
  "delete-channel": deleteChannel,
  "view-all-channels": viewAllChannels,
  "view-channels-by-author": viewChannelsByAuthor,

  "create-connection": createConnection,
  "delete-connection": deleteConnection,
  "view-all-connections": viewAllConnections,
  "view-connections-by-author": viewConnectionsByAuthor,
  "view-connections-by-channel": viewConnectionsByChannel,
  "view-connections-by-freet": viewConnectionsByFreet,

  "create-follow": createFollow,
  "delete-follow": deleteFollow,
  "view-all-follows": viewAllFollows,
  "view-follows-by-author": viewFollowsByAuthor,
  "view-follows-by-channel": viewFollowsByChannel,
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
