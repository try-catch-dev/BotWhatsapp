const axios = require('axios');
const { API_KEY_OPEN_AI } = require('../config');

const ChatAIHandler = async (text, msg) => {

    const cmd = text.split('/');

    if (cmd.length < 2) {
        return msg.reply('Format Salah. ketik *#ask/your question*');
    }

    msg.reply('sedang diproses, tunggu bentar ya.');

    const question = cmd[1];
    const response = await ChatGPTRequest(question)

    if (!response.success) {
        return msg.reply(response.message);
    }

    return msg.reply(response.data);
}


const ChatGPTRequest = async (text) => {

    const result = {
        success: false,
        data: "Aku gak tau",
        message: "",
    }

    return await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        data: {
            model: "text-davinci-003",
            prompt: text,
            max_tokens: 1000,
            temperature: 0
        },
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": "in-ID",
            "Authorization": `Bearer ${API_KEY_OPEN_AI}`,
        },
    })
        .then((response) => {
            if (response.status == 200) {

                const { choices } = response.data;

                if (choices && choices.length) {
                    result.success = true;
                    result.data = choices[0].text;
                }

            } else {
                result.message = "Failed response";
            }

            return result;
        })
        .catch((error) => {
            result.message = "Error : " + error.message;
            return result;
        });
}

module.exports = {
    ChatAIHandler
}