module.exports = {
  // slack access token
  slack_token: "",
  // outgoing webhook token
  webhook_token: "",
  // prefix of message you need(you must set same to webhook settings)
  keywords: [
    "math:"
  ],
  // bot user settings(see https://api.slack.com/methods/chat.postMessage)
  user_persona: {
    username: "mathlack bot"
  }
}