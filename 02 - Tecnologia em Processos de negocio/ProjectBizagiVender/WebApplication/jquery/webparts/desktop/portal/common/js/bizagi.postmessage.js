/*
*   Name: BizAgi PostMessage Wrapper
*   Author: Juan Pablo Manrique
*   Comments:
*   -   This script will define a base class to handle postmessage comunication
*/

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};

bizagi.postmessage = function (params) {

    var that = this;

    this.remoteServer = params.remoteServer;
    this.destination = params.destination;
    this.origin = params.origin;
    /**
    *   send, 
    *       destination: describe the origin msg object
    *       msg:    msg to send
    */
    this.send = function (msg) {
        var self = this;
        self.destination.postMessage(msg, self.remoteServer)
    };

    /**
    *   receive, override this method in each bizagi.postmessage instance
    */
    this.receive = function (msg) {
        that.receive(msg);
    };

    /**
    *   receive mesagge this method is private
    */
    this.receiveMessage = function () {
        var self = this;
        if (window.addEventListener) {
            self.origin.addEventListener("message", self.receive, true);
        }
        else {
            self.origin.attachEvent("onmessage", self.receive);
        }
    };
    // start receiving sequence
    this.receiveMessage();

}