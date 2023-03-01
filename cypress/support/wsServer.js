import { Server } from "mock-socket";

// const sockets = {}
// export function initServer() {
//   // useful to reset sockets when doing TDD and webpack refreshes the app
//   for (const socket of Object.values(sockets)) {
//     socket.close()
//   }

//   mockServer()
// }

// function mockServer() {
//   // Of course, your frontend will have to connecto to localhost:4000, otherwise change this
//   sockets.mockServer = new Server("ws://localhost:4000")

//   sockets.mockServer.on("connection", socket => {
//     sockets.server = socket;

//     // Will be sent any time a client connects
//     socket.send("Hello, world!")

//     socket.on("message", data => {
//       // Do whatever you want with the message, you can use socket.send to send a response
//     };
//   };
// }

const createServer = (url) => {
  return new Cypress.Promise((resolve) => {
    const mockServer = new Server(url);
    // Here we want to define on event actions
    mockServer.on("connection", (connection) => {
      connection.send("Connected to fake server");
      connection.on("message", (message) => {
        message = JSON.parse(message);
        connection.send(JSON.stringify(message));
      });
      resolve({ wsCon: connection, mockServer });
    });
  });
};

module.exports = { createServer };
