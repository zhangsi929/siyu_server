const express = require('express');
const router = express.Router();

const getOpenAIModels = () => {
  let models = ['gpt-4', 'text-davinci-003', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0301'];
  if (process.env.OPENAI_MODELS) models = String(process.env.OPENAI_MODELS).split(',');

  return models;
};

const getChatGPTBrowserModels = () => {
  let models = ['text-davinci-002-render-sha', 'gpt-4'];
  if (process.env.CHATGPT_MODELS) models = String(process.env.CHATGPT_MODELS).split(',');

  return models;
};

let i = 0;
router.get('/', async function (req, res) {
  let key, palmUser;
  try {
    key = require('../../data/auth.json');
  } catch (e) {
    if (i === 0) {
      console.log("No 'auth.json' file (service account key) found in /api/data/ for PaLM models");
      i++;
    }
  }

  if (process.env.PALM_KEY === 'user_provided') {
    palmUser = true;
    if (i <= 1) {
      console.log('User will provide key for PaLM models');
      i++;
    }
  }

  const google =
    key || palmUser
      ? { userProvide: palmUser, availableModels: ['chat-bison', 'text-bison'] }
      : false;
  const azureOpenAI = !!process.env.AZURE_OPENAI_KEY;
  const apiKey = process.env.OPENAI_KEY || process.env.AZURE_OPENAI_API_KEY;
  const openAI = apiKey
    ? { availableModels: getOpenAIModels(), userProvide: apiKey === 'user_provided' }
    : false;
  const bingAI = process.env.BINGAI_TOKEN
    ? { userProvide: process.env.BINGAI_TOKEN == 'user_provided' }
    : false;
  const chatGPTBrowser = process.env.CHATGPT_TOKEN
    ? {
      userProvide: process.env.CHATGPT_TOKEN == 'user_provided',
      availableModels: getChatGPTBrowserModels()
    }
    : false;

  res.send(JSON.stringify({ azureOpenAI, openAI, google, bingAI, chatGPTBrowser }));
});

module.exports = { router, getOpenAIModels, getChatGPTBrowserModels };
