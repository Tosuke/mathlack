import 'babel-polyfill' // for polyfill
import config from './config'
import * as slack from './slack'

global.test = () => {
  doPost({
    parameter: {
      token: config.webhook_token,
      text: 'math: x!',
      channel_id: 'C44HLB883',
      user_name: 'tosuke'
    }
  })
}

/**
 * webhook entry point
 * @param {*} e - parameters
 * @return {void}
 */
global.doPost = (e) => {
  const params = e.parameter;
  if(!isValidToken(params.token)) {
    Logger.log('invalid token')
  }

  if(!isValidMessage(params.text)) return

  const message = latexToMessage(trimMessage(params.text))
  slack.replyMessage(params, message)
}

/**
 * validate webhook token
 * @param {string} token
 * @return {boolean}
 */
function isValidToken(token) {
  return token === config.webhook_token
}

/**
 * validate message
 * @param {string} message
 * @return {boolean} 
 */
function isValidMessage(message) {
  if(message.length > config.max_length) return
  message = message.trim()
  return config.keywords
          .map(a => message.startsWith(a))
          .reduce((a, b) => a || b, false)
}

/**
 * convert latex to message
 * @param {string} latex
 * @return {string}
 */
function latexToMessage(latex) {
  const encoded = encodeURIComponent(latex).replace(/!/g, '%21')
  return `https://chart.apis.google.com/chart?cht=tx&chs=${config.size}&chl=${encoded}`
}

/**
 * triming message
 * @param {string} message
 * @return {string} 
 */
function trimMessage(message) {
  message = message.trim()
  const prefix = config.keywords.filter(a => message.startsWith(a))[0]
  return message
          .replace(prefix, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim()
}