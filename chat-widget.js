(function () {
    const defaultConfig = {
        primaryColor: '#000000',
        logo: 'https://kyoconnectai.com/kyoconnectai_logo.jpg',
        welcomeMessage: 'Hi welcome to KyoConnectAi, what can I help you',
        buttonSize: '60px',
        mobileButtonSize: '50px',
        widgetWidth: '380px',
        height: '370px',
        botId: '29934994343',
        botName: 'KyoConnectAI',
        textColor: '#ffffff',
        opacity: '1', // Added opacity to defaultConfig
        containerWidth: '380px' // Added containerWidth to defaultConfig
    };

    const config = {
        ...defaultConfig,
        ...(window.CHAT_WIDGET_CONFIG || {})
    };

    window.ChatWidget = {
        config: config,
        messages: [],

        toggleChat: function () {
            const chatContainer = document.querySelector('#chat-widget-container .chat-container');
            const chatButton = document.querySelector('#chat-widget-container .chat-button');

            if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
                chatContainer.style.display = 'block';
                chatContainer.classList.add('slide-up');
                chatContainer.classList.remove('slide-down');
                chatButton.style.display = 'none';

                setTimeout(() => {
                    document.querySelector('#chat-widget-container #userInput').focus();
                }, 300);
            } else {
                chatContainer.classList.remove('slide-up');
                chatContainer.classList.add('slide-down');

                setTimeout(() => {
                    chatContainer.style.display = 'none';
                    chatButton.style.display = 'block';
                }, 300);
            }
        },

        handleKeyPress: function (event) {  // Add async here
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        },

        sendMessage: async function () {
            const input = document.querySelector('#chat-widget-container #userInput');
            const message = input.value.trim();

            if (message) {
                // Add user message to messages array

                // Display user message
                this.addMessage('user', message);

                // Clear input
                input.value = '';
                input.style.height = '45px';

                try {
                    // Create FormData
                    const payload = {
                        botId: this.config.botId,
                        userText: message,
                        messages: this.messages
                    };

                    // Show loading indicator
                    const loadingMsg = this.addMessage('bot', '....');
                    loadingMsg.classList.add('loading-animation');

                    // Make API request with JSON
                    const response = await fetch('https://pmfm.ai/getResponseSupport', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();

                    // Remove loading indicator if added
                    if (loadingMsg && loadingMsg.textContent === '....') {
                        loadingMsg.remove();
                    }
                    
                    if (data.message !== "Something went wrong, please try again.") {
                        this.messages.unshift(message, data.message);
                    }
                    // Display bot response
                    this.addMessage('bot', data.message);

                } catch (error) {
                    console.log(error);

                    // Remove loading indicator if added
                    const loadingMsg = document.querySelector('#chat-widget-container .bot-message:last-child');
                    if (loadingMsg && loadingMsg.textContent === '....') {
                        loadingMsg.remove();
                    }

                    // Show error message to user
                    this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
                }

                if (this.messages.length >= 20) {
                    this.messages.splice(18, 2);  // Removes last 2 elements
                }
            }

        },

        addMessage: function (sender, message) {
            const chatBody = document.querySelector('#chat-widget-container #chatBody');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.textContent = message;
            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
            return messageDiv;
        },

        updateConfig: function (newConfig) {
            this.config = { ...this.config, ...newConfig };
        },

        initTextarea: function () {
            const textarea = document.querySelector('#chat-widget-container #userInput');
            textarea.addEventListener('input', function () {
                this.style.height = '45px';
                this.style.height = (this.scrollHeight) + 'px';
            });
        },
        
        //pre-defined questions
        initializeChat: function () {
    // Call initTextarea to set up the textarea
    // this.initTextarea();

    // Add predefined questions to the chat
    const predefinedQuestions = [
        'What is KyoConnectAI?',
        // 'How can I get started?',
        // 'Do you have a demo?',
        'What services do you offer?'
    ];
    this.addQuickReplies(predefinedQuestions);
},

addQuickReplies: function (questions) {
    const chatBody = document.querySelector('#chat-widget-container #chatBody');
    const quickRepliesContainer = document.createElement('div');
    quickRepliesContainer.className = 'quick-replies';

    questions.forEach((question) => {
        const button = document.createElement('button');
        button.className = 'quick-reply-button';
        button.textContent = question;
        button.onclick = () => {
            this.addMessage('user', question);
            this.sendMessageFromQuickReply(question);
        };
        quickRepliesContainer.appendChild(button);
    });

    chatBody.appendChild(quickRepliesContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
},

sendMessageFromQuickReply: function (message) {
    const input = document.querySelector('#chat-widget-container #userInput');
    input.value = message;
    this.sendMessage();
}
//pre-defined
    };

    const styles = `
        #chat-widget-container * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        #chat-widget-container .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: ${config.containerWidth};
            background: rgba(255, 255, 255, ${config.opacity});
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            display: none;
            z-index: 999999;
        }

        #chat-widget-container .chat-header {
            background: ${config.primaryColor};
            color: white;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #chat-widget-container .chat-header img {
            height: 30px;
        }

        #chat-widget-container .chat-header .bot-name {
            margin-left: 10px;
            font-size: 16px;
            font-weight: bold;
            color: ${config.textColor};
        }

        #chat-widget-container .close-button {
            color: white;
            cursor: pointer;
            font-size: 20px;
            padding: 5px;
        }

        #chat-widget-container .close-button:hover {
            opacity: 0.8;
        }

        #chat-widget-container .chat-body {
            height: ${config.height};
            padding: 15px;
            overflow-y: auto;
        }

        #chat-widget-container .chat-input {
            padding: 15px;
            border-top: 1px solid #ddd;
        }

        #chat-widget-container .powered-by {
            text-align: center;
            font-size: 12px;
            color: #666;
            padding: 4px;
            border-top: 1px solid #eee;
        }

        #chat-widget-container .chat-input textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
            resize: none;
            min-height: 45px;
            max-height: 120px;
            overflow-y: auto;
            line-height: 1.4;
            font-family: inherit;
        }

        #chat-widget-container .chat-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${config.primaryColor};
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 999999;
            width: ${config.buttonSize};
            height: ${config.buttonSize};
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            transition: transform 0.3s ease;
            overflow: hidden;
        }

        #chat-widget-container .chat-button img {
            width: 35px;
            height: 35px;
            object-fit: contain;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }

        #chat-widget-container .chat-button:hover {
            transform: scale(1.1);
        }

        #chat-widget-container .message {
            margin: 12px 0;
            padding: 12px;
            border-radius: 5px;
            font-size: 14px;
            white-space: pre-wrap;
        }

        #chat-widget-container .user-message {
            background: #e3f2fd;
            margin-left: 20px;
        }

        #chat-widget-container .bot-message {
            background: #f5f5f5;
            margin-right: 20px;
        }

        #chat-widget-container .loading-animation::after {
            content: '....';
            display: inline-block;
            animation: loadingDots 1s steps(4, end) infinite;
        }

        @keyframes loadingDots {
            0%, 100% { content: '....'; }
            25% { content: '.   '; }
            50% { content: '..  '; }
            75% { content: '... '; }
        }

        @media screen and (max-width: 768px) {
            #chat-widget-container .chat-container {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                border-radius: 0 !important;
            }

            #chat-widget-container .chat-header {
                border-radius: 0 !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                z-index: 999999 !important;
            }

            #chat-widget-container .chat-body {
                height: calc(100% - 130px) !important;
                margin-top: 60px !important;
                padding-bottom: 70px !important;
            }

            #chat-widget-container .chat-input {
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                background: white !important;
                z-index: 999999 !important;
            }

            #chat-widget-container .chat-button {
                width: ${config.mobileButtonSize} !important;
                height: ${config.mobileButtonSize} !important;
            }

            #chat-widget-container .chat-button img {
                width: 30px !important;
            }
        }

        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }

        @keyframes slideDown {
            from { transform: translateY(0); }
            to { transform: translateY(100%); }
        }

        #chat-widget-container .slide-up {
            animation: slideUp 0.3s ease-out;
        }

        #chat-widget-container .slide-down {
            animation: slideDown 0.3s ease-out;
        }
        
#chat-widget-container .quick-replies {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

#chat-widget-container .quick-reply-button {
    background: #e0e0e0;
    color: #000;
    border: none;
    border-radius: 20px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
}

#chat-widget-container .quick-reply-button:hover {
    background: #d6d6d6;
}

        
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const chatHTML = `
        <button class="chat-button" onclick="ChatWidget.toggleChat()">
            <img src="${config.logo}" alt="Support Logo">
        </button>

        <div class="chat-container">
            <div class="chat-header">
                <div style="display: flex; align-items: center;">
                    <img src="${config.logo}" alt="Support Logo">
                    <span class="bot-name">${config.botName}</span>
                </div>
                <span class="close-button" onclick="ChatWidget.toggleChat()">×</span>
            </div>
            <div class="chat-body" id="chatBody">
                <div class="message bot-message">${config.welcomeMessage}</div>
            </div>
            <div class="chat-input">
                <textarea id="userInput" placeholder="Type your message..." onkeydown="ChatWidget.handleKeyPress(event)"></textarea>
            </div>
            <div class="powered-by">
                Powered by <a href="https://kyoconnectai.com/" target="_blank">KyoConnectAI</a>
                | AI can make mistakes
            </div>
        </div>
    `;

    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'chat-widget-container';
    widgetContainer.innerHTML = chatHTML;
    document.body.appendChild(widgetContainer);

    // Initialize textarea auto-resize
    ChatWidget.initTextarea(); 
    // ChatWidget.initializeChat();

    // Add mobile touch handlers
    document.querySelector('#chat-widget-container .chat-container').addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });

    document.querySelector('#chat-widget-container .chat-body').addEventListener('touchmove', function (e) {
        e.stopPropagation();
    }, { passive: true });
})();
