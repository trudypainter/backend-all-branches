/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllConnections(fields) {
  fetch("/api/connections").then(showResponse).catch(showResponse);
}

function viewConnectionsByAuthor(fields) {
  fetch(`/api/connections?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewConnectionsByChannel(fields) {
  fetch(`/api/connections?channel=${fields.channel}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewConnectionsByFreet(fields) {
  fetch(`/api/connections?freet=${fields.freet}`)
    .then(showResponse)
    .catch(showResponse);
}

function createConnection(fields) {
  console.log(fields);

  fetch("/api/connections", {
    method: "POST",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function deleteConnection(fields) {
  fetch(`/api/connections/${fields.id}`, { method: "DELETE" })
    .then(showResponse)
    .catch(showResponse);
}
