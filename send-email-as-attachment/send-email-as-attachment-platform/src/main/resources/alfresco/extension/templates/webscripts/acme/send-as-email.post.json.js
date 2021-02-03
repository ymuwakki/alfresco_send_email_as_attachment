function getJsonValue(name) {
   return (json.has(name) ? json.get(name) : "");
}

var to = getJsonValue("to");
var cc = getJsonValue("cc");
var from = getJsonValue("from");
var subject = getJsonValue("subject");
var message = getJsonValue("message");

var nodeRefStr = getJsonValue("nodeRef");
   
var sendAsEmail = actions.create("send-as-email");
sendAsEmail.parameters.to = to;
sendAsEmail.parameters.cc = cc;
sendAsEmail.parameters.subject = subject;
sendAsEmail.parameters.body_text = message;
sendAsEmail.parameters.from = from;

var node = search.findNode(nodeRefStr);
sendAsEmail.execute(node);