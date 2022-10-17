/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */
console.log("thsi got importeds");

function viewAllChannels(fields) {
  console.log("viewings all channels...");

  fetch("/api/channel").then(showResponse).catch(showResponse);
}

function viewChannelsByAuthor(fields) {
  fetch(`/api/channel?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function createChannel(fields) {
  fetch("/api/channel", {
    method: "POST",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function editChannel(fields) {
  fetch(`/api/channel/${fields.id}`, {
    method: "PUT",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function deleteChannel(fields) {
  fetch(`/api/channel/${fields.id}`, { method: "DELETE" })
    .then(showResponse)
    .catch(showResponse);
}
