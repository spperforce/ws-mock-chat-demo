import { createServer } from "../support/wsServer";

describe("WebSockets Chat UI", () => {
  describe("on connection to WS server/source", () => {
    let wsServer = createServer("wss://9af4375c1960.ngrok.io");
    it("is expected to display connection message", () => {
      cy.visitWithWsStub("/");
      cy.get("#nick-input").type("User 1");
      cy.get("#set-nick").click();
      const message = {
        nick: "Thomas",
        message: "Hello World",
      };
      cy.wrap(wsServer).then(({ wsCon }) => {
        wsCon.send(
          message.constructor.name === "Object"
            ? JSON.stringify(message)
            : message
        );
      });
      cy.get("body").should("contain.text", "Connected to fake server");
    });
    after(() => {
      cy.wrap(wsServer).then(({ mockServer }) => {
        console.log("stop mockserver", mockServer);
        mockServer.stop();
      });
    });
  });

  describe("on receiving an incomming mssage, the chat UI", () => {
    it("is expected to display a new message", () => {
      let wsServer = createServer("wss://9af4375c1960.ngrok.io");
      cy.visitWithWsStub("/");
      cy.get("#nick-input").type("User 1");
      cy.get("#set-nick").click();

      cy.wrap(wsServer).then(({ wsCon, mockServer }) => {
        const mockSocket = new WebSocket("wss://9af4375c1960.ngrok.io");

        mockSocket.onmessage = function message(event) {
          console.log("message received 2");
          console.log("message arrived", { event });
        };

        const message = {
          nick: "Thomas",
          message: "Hello World",
        };

        wsCon.send(
          message.constructor.name === "Object"
            ? JSON.stringify(message)
            : message
        );
      });
    });
  });

  describe("on sending a messege, the chat UI", () => {
    it("is expected to display the message that was just sent", () => {
      cy.visitWithWsStub("/");
      cy.get("#nick-input").type("User 1");
      cy.get("#set-nick").click();
      cy.get("#chat-input").type("Hello Mars");
      cy.get("#send-chat").click();
      cy.get("#messages").should("contain.text", "User 1: Hello Mars");
    });
  });
});
