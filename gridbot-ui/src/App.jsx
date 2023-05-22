import { useEffect, useState } from "react";
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
    useEffect(() => {
        window.reactACInterface?.resizeDialog({ width: "400", height: "55" });
    }, []);

    const [showNotificationIcon, setShowNotificationIcon] = useState(false);
    const [height, setHeight] = useState(500);

    const handleResize = () => {
        setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

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
        window.reactACInterface?.resizeDialog({ width: "400", height: "500" });

        const newMessage = {
            content: message.replace(/<s.*">/, "").replace(/<\/span>/, ""),
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

    const pushAnswer = async (question) => {
        if (question.includes("polygonal")) {
            setTimeout(() => {
                let newMessages = [...messages];

                newMessages.push({
                    content: `Hey Judy,

Here's a simple guide to cutting a polygonal hole in a Fill:

1. Select the Fill you want to modify.
2. Activate the Fill tool.
3. Trace the corners of the hole polygon by clicking on them. If there is an existing shape that you want to cut out from the Fill, use the Magic Wand tool. Press down the Spacebar and hover over the element to trace its boundaries. You'll receive instant feedback, then click to complete the process.

Best, Jeff`,
                    sender: "GridBot",
                    expand: true,
                    type: "html",
                });

                setMessages(newMessages);
                setShowNotificationIcon(true);
            }, 15000);
        }
    };

    const changeExpand = async (i) => {
        let newMessages = [...messages];

        newMessages[i].expand = true;

        if (
            newMessages[i].message?.content ===
            "<b>Post question on Community</b>"
        ) {
            pushAnswer(newMessages[i].question);
        }
        newMessages[i].message = "";

        setMessages(newMessages);

        //console.log(newMessages[i].message?.content);
    };

    async function processMessageToGridBot(chatMessages) {
        if (chatMessages[chatMessages.length - 1].content === ":)") {
            setTimeout(() => {
                setMessages([
                    ...chatMessages,
                    {
                        content: `<div style="display:flex;">Why did the architect break up with his girlfriend?<br /><br />Because he just wasn't archi-texturaly compatible.</div>`,
                        sender: "GridBot",
                        expand: true,
                        type: "html",
                    },
                ]);
                setIsTyping(false);
            }, 2000);
        } else {
            fetch("http://localhost:8081/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message:
                        chatMessages[chatMessages.length - 1].content +
                        " archicad",
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
                /></div><button style="display:flex; align-items:center; padding: 5px" onClick="window.open('https://helpcenter.graphisoft.com/')" ">Help Center</button></div>` ||
                                    "I'm sorry! Can you repeat your question?",
                                sender: "GridBot",
                                expand: true,
                                type: "html",
                            },
                            {
                                content: `<div style="display:flex; flex-direction: column; justify-content: start;"> <div> I posted "<b>${
                                    chatMessages[chatMessages.length - 1]
                                        .content
                                }</b>" to Graphisoft Community Modeling board. I will notify you here if someone replies. </div> <div style="width: 150px; height: 50px; margin-bottom: 10px"> <button style="display:flex; align-items:center; padding: 5px" onClick="window.open('https://community.graphisoft.com/t5/International/ct-p/EN')" "><img
                                src="icons/Frame_52.svg"
                                alt="icon"
                                style="width: 20px; height: 20px; padding-top: 1px; padding-bottom: 1px;"
                            /> Community</button> </div> </div>`,
                                message: {
                                    content:
                                        "<b>Post question on Community</b>",
                                    sender: "GridBot",
                                    type: "html",
                                },
                                expand: false,
                                sender: "GridBot",
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
                /></div><button style="display:flex; align-items:center; padding: 5px" onClick="window.open('https://helpcenter.graphisoft.com/')" ">Help Center</button></div>` ||
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
                                    content: "<b>See more...</b>",
                                    sender: "GridBot",
                                    type: "html",
                                },
                                expand: false,
                                sender: "GridBot",
                                type: "html",
                            },
                            {
                                content: `<div style="display:flex; flex-direction: column; justify-content: start;"> <div> I posted "<b>${
                                    chatMessages[chatMessages.length - 1]
                                        .content
                                }</b>" to Graphisoft Community Modeling board. I will notify you here if someone replies. </div> <div style="width: 150px; height: 50px; margin-bottom: 10px"> <button style="display:flex; align-items:center; padding: 5px" onClick="window.open('https://community.graphisoft.com/t5/International/ct-p/EN')" "><img
                                src="icons/Frame_52.svg"
                                alt="icon"
                                style="width: 20px; height: 20px; padding-top: 1px; padding-bottom: 1px;"
                            /> Community</button> </div> </div>`,
                                message: {
                                    content:
                                        "<b>Post question on Community</b>",
                                    sender: "GridBot",
                                    type: "html",
                                },
                                question:
                                    chatMessages[chatMessages.length - 1]
                                        .content,
                                expand: false,
                                sender: "GridBot",
                                type: "html",
                            },
                        ]);
                    }

                    setIsTyping(false);
                });
        }
    }

    if (height <= 55) {
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
                    <MainContainer>
                        <ChatContainer>
                            <MessageInput
                                placeholder="Ask me anything..."
                                onSend={handleSend}
                                attachButton={false}
                            />
                        </ChatContainer>
                    </MainContainer>
                </div>
            </div>
        );
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
                        alignItems: "center",
                        backgroundColor: "#e7e7e7",
                        borderBottom: "1px solid rgba(0,0,0,0.2)",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <div
                            className="generalButton"
                            onClick={() =>
                                window.open(
                                    "https://community.graphisoft.com/t5/International/ct-p/EN"
                                )
                            }
                        >
                            {!showNotificationIcon ? (
                                <img
                                    src={`icons/Frame_52.svg`}
                                    alt={"icon"}
                                    style={{ cursor: "pointer" }}
                                />
                            ) : (
                                <img
                                    src={`icons/Comm_Not.svg`}
                                    alt={"icon"}
                                    style={{ cursor: "pointer" }}
                                />
                            )}{" "}
                        </div>
                        <div
                            className="generalButton"
                            onClick={() => window.location.reload()}
                        >
                            <img
                                src={`icons/Frame_44.svg`}
                                alt={"icon"}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    </div>
                    <div className="generalButton" onClick={() => {}}>
                        <img
                            src={`icons/Frame_48.svg`}
                            alt={"icon"}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                </div>
                <div
                    className="container"
                    style={{
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
                                            >
                                                <Message.HtmlContent
                                                    html={
                                                        message.message.content
                                                    }
                                                />
                                            </Message>
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
