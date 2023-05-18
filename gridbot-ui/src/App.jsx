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
                                `<div style="display:flex;">${body.text.replace(
                                    /\[\^[0-9]*\^\]/g,
                                    ""
                                )}</div><br><div style="display:flex; align-items:center; justify-content:space-between"><div><img
                    src="icons/Frame_43.svg"
                    alt="icon"
                    style="width: 22px; height: 22px; cursor: pointer"
                /></div><div><img
                    src="icons/Frame_54.svg"
                    alt="icon"
                    style="width: 22px; height: 22px; cursor: pointer"
                /><span>  </span><img
                    src="icons/Frame_55.svg"
                    alt="icon"
                    style="width: 22px; height: 22px; cursor: pointer"
                /></div><button style="display:flex; align-items:center; padding: 5px" onClick="parent.open('https://community.graphisoft.com/t5/International/ct-p/EN')" "><img
                    src="icons/Frame_52.svg"
                    alt="icon"
                    style="width: 20px; height: 20px"
                /> Community</button></div>` ||
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
                                `<div style="display:flex;">${body.text.replace(
                                    /\[\^[0-9]*\^\]/g,
                                    ""
                                )}</div><br><div style="display:flex; align-items:center; justify-content:space-between"><div><img
                    src="icons/Frame_43.svg"
                    alt="icon"
                    style="width: 22px; height: 22px; cursor: pointer"
                /></div><div><img
                    src="icons/Frame_54.svg"
                    alt="icon"
                    style="width: 22px; height: 22px; cursor: pointer"
                /><span>  </span><img
                    src="icons/Frame_55.svg"
                    alt="icon"
                    style="width: 22px; height: 22px; cursor: pointer"
                /></div><button style="display:flex; align-items:center; padding: 5px" onClick="parent.open('https://community.graphisoft.com/t5/International/ct-p/EN')" "><img
                    src="icons/Frame_52.svg"
                    alt="icon"
                    style="width: 20px; height: 20px"
                /> Community</button></div>` ||
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
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "#e7e7e7",
                        borderBottom: "1px solid rgba(0,0,0,0.2)",
                    }}
                >
                    <div
                        onClick={() =>
                            (window.location.href =
                                "https://community.graphisoft.com/t5/International/ct-p/EN")
                        }
                    >
                        <img
                            src={`icons/Frame_52.svg`}
                            alt={"icon"}
                            style={{ cursor: "pointer" }}
                        />{" "}
                        <img
                            src={`icons/Frame_44.svg`}
                            alt={"icon"}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                    <div onClick={() => {}}>
                        <img
                            src={`icons/Frame_48.svg`}
                            alt={"icon"}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        height: "100%",
                        paddingTop: "3px",
                        backgroundColor: "#e7e7e7",
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
