// src/services/chatgptService.js
import axios from 'axios';

const chatgptApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL+'playground/api/chatgpt', // Adjust the URL as needed
});

export const getChatGptResponse = async (input) => {
    try {
        const response = await chatgptApi.post('/', { input });
        return response.data;
    } catch (error) {
        console.error('Error communicating with ChatGPT API:', error);
        throw error;
    }
};
