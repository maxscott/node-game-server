
var topics = [];

var _this = module.exports = {

  getTopics: function getTopics () {
    return topics;
  },

  subscribe: function subscribe (topic, subscriber) {
    if (topics[topic] === undefined) {
      topics[topic] = [];
    }

    var index = topics[topic].push(subscriber) - 1;

    return {
      remove: function remove () {
        delete topics[topic][index];
      }
    };
  },

  publish: function(topic, message) {

    if (topics[topic] === undefined) return;

    topics[topic].forEach(function (cb) {
      cb(message);
    });
  }
}
