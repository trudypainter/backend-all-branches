/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllSubscribes(fields) {
  fetch("/api/subscribes").then(showResponse).catch(showResponse);
}

function viewSubscribesByAuthor(fields) {
  console.log(fields.author);
  fetch(`/api/subscribes?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewSubscribesBySubscribingTo(fields) {
  fetch(`/api/subscribes?subscribingTo=${fields.subscribingTo}`)
    .then(showResponse)
    .catch(showResponse);
}

function createSubscribe(fields) {
  console.log(fields);

  fetch("/api/subscribes", {
    method: "POST",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function deleteSubscribe(fields) {
  fetch(`/api/subscribes/${fields.id}`, { method: "DELETE" })
    .then(showResponse)
    .catch(showResponse);
}
