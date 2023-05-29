/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:08:32
 * @LastEditTime: 2023-05-28 22:07:38
 * @FilePath: /guangqi/newbackend/models/Conversation.js
 * @Description:
 *
 * 这个 JavaScript 文件主要是处理与会话（Conversation）相关的数据库操作。它导入了前面定义的 "Conversation" 数据模型和一些消息（Message）相关的操作。
 *  这个文件导出了一些函数，这些函数可以对 Conversation 数据库进行查询、更新、删除等操作
 * 这个文件的主要目的是为了提供一种方式来操作和管理会话数据，包括获取会话、保存会话、获取会话标题和删除会话等。
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
// const { Conversation } = require('./plugins');

const Conversation = require("./schema/convoSchema");
const { getMessages, deleteMessages } = require("./Message");

//在 module.exports 之外定义函数，可以使得函数在文件内部被多次重用。例如，在你的文件中，getConvo 函数在 getConvoTitle 函数中被使用。
const getConvo = async (user, conversationId) => {
  try {
    return await Conversation.findOne({ user, conversationId }).exec();
  } catch (error) {
    console.log(error);
    return { message: "Error getting single conversation" };
  }
};

module.exports = {
  Conversation,
  saveConvo: async (user, { conversationId, newConversationId, ...convo }) => {
    try {
      const messages = await getMessages({ conversationId });
      const update = { ...convo, messages, user };
      if (newConversationId) {
        update.conversationId = newConversationId;
      }

      return await Conversation.findOneAndUpdate(
        { conversationId: conversationId, user },
        update,
        {
          new: true,
          upsert: true,
        }
      ).exec();
    } catch (error) {
      console.log(error);
      return { message: "Error saving conversation" };
    }
  },
  getConvosByPage: async (user, pageNumber = 1, pageSize = 14) => {
    try {
      const totalConvos = (await Conversation.countDocuments({ user })) || 1;
      const totalPages = Math.ceil(totalConvos / pageSize);
      const convos = await Conversation.find({ user })
        .sort({ createdAt: -1, created: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();
      return { conversations: convos, pages: totalPages, pageNumber, pageSize };
    } catch (error) {
      console.log(error);
      return { message: "Error getting conversations" };
    }
  },
  getConvosQueried: async (user, convoIds, pageNumber = 1, pageSize = 14) => {
    try {
      if (!convoIds || convoIds.length === 0) {
        return { conversations: [], pages: 1, pageNumber, pageSize };
      }

      const cache = {};
      const convoMap = {};
      const promises = [];
      // will handle a syncing solution soon
      const deletedConvoIds = [];

      convoIds.forEach((convo) =>
        promises.push(
          Conversation.findOne({
            user,
            conversationId: convo.conversationId,
          }).exec()
        )
      );

      const results = (await Promise.all(promises)).filter((convo, i) => {
        if (!convo) {
          deletedConvoIds.push(convoIds[i].conversationId);
          return false;
        } else {
          const page = Math.floor(i / pageSize) + 1;
          if (!cache[page]) {
            cache[page] = [];
          }
          cache[page].push(convo);
          convoMap[convo.conversationId] = convo;
          return true;
        }
      });

      // const startIndex = (pageNumber - 1) * pageSize;
      // const convos = results.slice(startIndex, startIndex + pageSize);
      const totalPages = Math.ceil(results.length / pageSize);
      cache.pages = totalPages;
      cache.pageSize = pageSize;
      return {
        cache,
        conversations: cache[pageNumber] || [],
        pages: totalPages || 1,
        pageNumber,
        pageSize,
        // will handle a syncing solution soon
        filter: new Set(deletedConvoIds),
        convoMap,
      };
    } catch (error) {
      console.log(error);
      return { message: "Error fetching conversations" };
    }
  },
  getConvo,
  // getConvoTitle 这个函数获取一个会话的标题。如果会话不存在或者标题为 null，它将返回 "新对话"。
  /* chore: this method is not properly error handled */
  getConvoTitle: async (user, conversationId) => {
    try {
      const convo = await getConvo(user, conversationId);
      /* ChatGPT Browser was triggering error here due to convo being saved later */
      if (convo && !convo.title) {
        return null;
      } else {
        // TypeError: Cannot read properties of null (reading 'title')
        return convo?.title || "新对话";
      }
    } catch (error) {
      console.log(error);
      return { message: "Error getting conversation title" };
    }
  },
  //这个函数删除一个用户的一组会话，并返回删除的数量。
  deleteConvos: async (user, filter) => {
    let toRemove = await Conversation.find({ ...filter, user }).select(
      "conversationId"
    );
    const ids = toRemove.map((instance) => instance.conversationId);
    let deleteCount = await Conversation.deleteMany({ ...filter, user }).exec();
    deleteCount.messages = await deleteMessages({
      conversationId: { $in: ids },
    });
    return deleteCount;
  },
};
