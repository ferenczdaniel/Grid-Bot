import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
    //  Explain things like you're talking to a software professional with 5 years of experience.
    role: "system",
    content: "Explain things like you're talking to a 5 year old",
};

function App() {
    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm BingAI! Ask me anything!",
            sentTime: "just now",
            sender: "BingAI",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: "outgoing",
            sender: "user",
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);

        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        setIsTyping(true);
        await processMessageToBingAI(newMessages);
    };

    async function processMessageToBingAI(chatMessages) {
        // messages is an array of messages
        // Format messages for chatGPT API
        // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
        // So we need to reformat

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "BingAI") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message };
        });

        // Get the request body set up with the model we plan to use
        // and the messages which we formatted above. We add a system message in the front to'
        // determine how we want chatGPT to act.
        const apiRequestBody = {
            messages: [
                systemMessage, // The system message DEFINES the logic of our chatGPT
                ...apiMessages, // The messages from our chat with ChatGPT
            ],
        };

        fetch("http://localhost:8081/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message:
                    apiRequestBody.messages[apiRequestBody.messages.length - 1]
                        .content +
                    ". If this question is Archicad specific, please give me the answer from https://helpcenter.graphisoft.com/ or https://community.graphisoft.com/, otherwise anywhere",
            }),
        })
            .then((data) => {
                return data.json();
            })
            .then((body) => {
                console.log(body);

                if (body.detail.sourceAttributions.length === 0) {
                    setMessages([
                        ...chatMessages,
                        {
                            message:
                                body.text.replace(/\[\^[0-9]*\^\]/g, "") ||
                                "I'm sorry! Can you repeat your question?",
                            sender: "BingAI",
                        },
                    ]);
                } else {
                    setMessages([
                        ...chatMessages,
                        {
                            message:
                                body.text.replace(/\[\^[0-9]*\^\]/g, "") ||
                                "I'm sorry! Can you repeat your question?",
                            sender: "BingAI",
                        },
                        {
                            content:
                                "See more: " +
                                body.detail.sourceAttributions
                                    .map(
                                        (obj) =>
                                            `<a href=${obj.seeMoreUrl}>${obj.seeMoreUrl}</a>`
                                    )
                                    .join(", "),
                            sender: "BingAI",
                            type: "html",
                        },
                    ]);
                }

                setIsTyping(false);
            });
    }

    return (
        <div className="App">
            <div
                style={{
                    position: "relative",
                    height: "100vh",
                    width: "100%",
                }}
            >
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            scrollBehavior="smooth"
                            typingIndicator={
                                isTyping ? (
                                    <TypingIndicator content="BingAI is typing" />
                                ) : null
                            }
                        >
                            {messages.map((message, i) => {
                                console.log(message);
                                if (message.type === "html") {
                                    return (
                                        <Message key={i} model={message}>
                                            <Message.HtmlContent
                                                html={message.content}
                                            />
                                        </Message>
                                    );
                                } else {
                                    return <Message key={i} model={message} />;
                                }
                            })}
                        </MessageList>
                        <MessageInput
                            placeholder="Type message here"
                            onSend={handleSend}
                        />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
}

export default App;
