var angular = require('angular'),
    module = angular.module('myapp.services', []),
    MessageService;

MessageService = (function() {
  function MessageService() {
    console.debug("Intialized MessageService");
  }

  MessageService.prototype.getMessage = function() {
    return "Hello from MessageService!";
  };

  return MessageService;

})();

module.service('messageService', MessageService);
