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

function App() {
    const [messages, setMessages] = useState([
        {
            content: "Hello, I'm GridBot! Ask me anything!",
            sentTime: "just now",
            sender: "GridBot",
            expand: true,
            type: "html",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (message) => {
        const newMessage = {
            content: message,
            expand: true,
            type: "html",
            direction: "outgoing",
            sender: "user",
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);

        setIsTyping(true);
        await processMessageToGridBot(newMessages);
    };

    const changeExpand = (i) => {
        let newMessages = [...messages];

        newMessages[i].expand = true;
        newMessages[i].message = "";

        setMessages(newMessages);
    };

    async function processMessageToGridBot(chatMessages) {
        fetch("http://localhost:8081/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message:
                    chatMessages[chatMessages.length - 1].content +
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
                            content:
                                body.text.replace(/\[\^[0-9]*\^\]/g, "") ||
                                "I'm sorry! Can you repeat your question?",
                            sender: "GridBot",
                            expand: true,
                            type: "html",
                        },
                    ]);
                } else {
                    setMessages([
                        ...chatMessages,
                        {
                            content:
                                body.text.replace(/\[\^[0-9]*\^\]/g, "") ||
                                "I'm sorry! Can you repeat your question?",
                            sender: "GridBot",
                            expand: true,
                            type: "html",
                        },
                        {
                            content:
                                "Learn more: " +
                                body.detail.sourceAttributions
                                    .map(
                                        (obj) =>
                                            `<a href=${obj.seeMoreUrl}>${obj.seeMoreUrl}</a>`
                                    )
                                    .join(", "),
                            message: {
                                message: "See more...",
                                sender: "GridBot",
                            },
                            expand: false,
                            sender: "GridBot",
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
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        height: "30px",
                    }}
                ></div>
                <div
                    style={{
                        height: "100%",
                    }}
                >
                    <MainContainer>
                        <ChatContainer>
                            <MessageList
                                scrollBehavior="smooth"
                                typingIndicator={
                                    isTyping ? (
                                        <TypingIndicator content="GridBot is typing" />
                                    ) : null
                                }
                            >
                                {messages.map((message, i) => {
                                    console.log(message);
                                    if (message.expand) {
                                        return (
                                            <Message key={i} model={message}>
                                                <Message.HtmlContent
                                                    html={message.content}
                                                />
                                            </Message>
                                        );
                                    } else {
                                        return (
                                            <Message
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    changeExpand(i);
                                                }}
                                                key={i}
                                                model={message.message}
                                            />
                                        );
                                    }
                                })}
                            </MessageList>
                            <MessageInput
                                placeholder="Ask me anything..."
                                onSend={handleSend}
                                attachButton={false}
                            />
                        </ChatContainer>
                    </MainContainer>
                </div>
            </div>
        </div>
    );
}

export default App;