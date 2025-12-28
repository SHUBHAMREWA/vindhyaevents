"use client"

import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { useEffect } from 'react';



// App.tsx


 const ChatbotWidget = () => {
	
	useEffect(() => {
		createChat({
			webhookUrl: 'https://sukku.app.n8n.cloud/webhook/a8df0b14-9381-4d3e-be4b-fbf75710d8f7/chat'
		});
	}, []);

	return null ;
};

export default ChatbotWidget ;