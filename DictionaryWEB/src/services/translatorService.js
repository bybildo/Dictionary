import axios from 'axios';
import { v4 as guid } from 'uuid';

const key = 'Bw9FGZtmgteMxQRtc8ZDnQGT4tGSEWelfKygQrRhoR8mpr7oqUCBJQQJ99BGACgEuAYXJ3w3AAAbACOG9YfW';
const endpoint = 'https://api.cognitive.microsofttranslator.com';
const location = 'italynorth';

export async function translateText(text, to, ids = null) {
    try {
        const inputTexts = Array.isArray(text)
            ? text.map(t => ({ text: t }))
            : [{ text }];

        const response = await axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': guid().toString()
            },
            params: {
                'api-version': '3.0',
                to
            },
            data: inputTexts,
            responseType: 'json'
        });

        if (ids) {
            for (let i = 0; i < response.data.length; i++) {
                response.data[i].id = ids[i];
            }
        }

        return response.data;
    } catch (error) {
        console.error('Translation error:', error);
        // throw error;
    }
}