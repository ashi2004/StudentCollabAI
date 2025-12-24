import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer'

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {    
            window.hljs.highlightElement(ref.current)
            ref.current.removeAttribute('data-highlighted')
        }
    }, [props.className, props.children])

    return <code {...props} ref={ref} />
}


//SAFE JSON PARSER
function safeJSONParse(str) {
    try {
        if (!str || typeof str !== "string") return { text: "" };

        let cleaned = str
            .replace(/```json/g, "") // Remove ```json markers
            .replace(/```/g, "")     // Remove ``` markers
            .trim();                 // Trim whitespace
 
        const match = cleaned.match(/\{[\s\S]*\}$/);   
        //this line is using a regular expression to search for a substring within the cleaned 
        // string that starts with an opening curly brace '{' and ends with a closing curly brace '}'. 
        // The [\s\S]* part matches any characters (including newlines) in between the braces. 
        // The $ at the end ensures that this match occurs at the end of the string. 
        // Essentially, this line is trying to isolate a JSON object from the end of the cleaned string.
        if (!match) return { text: cleaned }; // If no JSON object found, return the whole cleaned string as text

        return JSON.parse(match[0]);// Parse and return the JSON object

    } catch (err) {
        console.error("safeJSONParse failed:", err, str);
        return { text: str };
    }
}


const Project = () => {
    const location = useLocation()

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set())
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext)
  
    ///check this/////
    const messageBox = useRef(null)
    ///////////


    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [fileTree, setFileTree] = useState({})

    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])

    const [webContainer, setWebContainer] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)

    const [runProcess, setRunProcess] = useState(null)


    const handleUserClick = (id) => {
        setSelectedUserId(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };


    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(() => {
            setIsModalOpen(false)
        }).catch(err => console.log(err))
    }


    //AI MESSAGE UI RENDER
    function WriteAiMessage(message) {
        const parsed = safeJSONParse(message);

        return (
            <div className='overflow-auto bg-slate-950 text-white rounded-sm p-2'>
                <Markdown                  // Use markdown-to-jsx to parse markdown
                    children={parsed.text} // Render markdown text
                    options={{
                        overrides: { code: SyntaxHighlightedCode }, // Syntax highlight code blocks
                    }}
                />
            </div>
        )
    }


    //MAIN EFFECT (SOCKET + PROJECT LOAD)
    useEffect(() => {

        initializeSocket(project._id)
        if(!webContainer){
           getWebContainer().then(container => {
            setWebContainer(container)
            console.log("container started")
        })
        }

        //MESSAGE HANDLER
        const messageHandler = (data) => {
            console.log("Incoming message:", data);

            const parsed = safeJSONParse(data.message);

            // Handle AI fileTree edits
            if (data.sender._id === "ai" && parsed.fileTree) {
                webContainer?.mount(parsed.fileTree);
                setFileTree(parsed.fileTree);
            }

            // Push chat message
            setMessages(prev => [
                ...prev,
                {
                    sender: data.sender,
                    message: parsed.text ?? data.message
                }
            ]);
        };

        receiveMessage("project-message", messageHandler);


        // Load project + users
        axios.get(`/projects/get-project/${location.state.project._id}`)
            .then(res => {
                setProject(res.data.project)
                setFileTree(res.data.project.fileTree || {})
            })

         axios.get('/users/all')
            .then(res => setUsers(res.data.users))
            .catch(err => console.log(err))


        return () => {
            receiveMessage("project-message", () => { }); // Safe detach
        };

    }, [])



    //AUTO SCROLL
    useEffect(() => {
        if (messageBox.current) {
            messageBox.current.scrollTop =
                messageBox.current.scrollHeight;
        }
    }, [messages]);



    const send = () => {
        // Send message to server
        sendMessage("project-message", {
            message,
            sender: user
        });
        
        setMessages(prev => [...prev, { sender: user, message }]); // Optimistic UI update
        setMessage(""); // Clear input field
    };


    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).catch(err => console.log(err))
    }



    return (
        <main className='h-screen w-screen flex bg-[#0a0a0f]'>

            {/* LEFT PANEL - Chat */}
            <section className="left relative flex flex-col h-screen w-[35%] min-w-[22rem] bg-[#13131a] border-r border-gray-800/50">
                <header className='flex justify-between items-center p-3 px-4 w-full bg-[#0a0a0f] border-b border-gray-800/50'>
                    <button className='flex items-center gap-2 px-3 py-2 bg-[#6D54B6]/10 border border-[#6D54B6]/30 rounded-lg text-[#6D54B6] hover:bg-[#6D54B6]/20 transition-all text-sm' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-user-add-line"></i>
                        <span>Add collaborator</span>
                    </button>

                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 px-3 bg-gray-800/50 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all'>
                        <i className="ri-group-fill"></i>
                    </button>
                </header>


                {/* CHAT */}
                <div className="conversation-area flex-grow flex flex-col h-full">

                    <div
                        ref={messageBox}
                        className="message-box flex-grow flex flex-col gap-3 overflow-auto scrollbar-hide p-4"
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`
                                    ${msg.sender._id === user._id.toString() ? 'self-end bg-[#6D54B6]' : 'self-start bg-[#1a1a24]'} 
                                    p-3 px-4 rounded-2xl shadow-sm max-w-[75%] ${msg.sender._id === user._id.toString() ? 'rounded-br-md' : 'rounded-bl-md'}
                                `}
                            >
                                <small className={`text-xs ${msg.sender._id === user._id.toString() ? 'text-purple-200' : 'text-gray-500'}`}>
                                    {msg.sender.email}
                                </small>

                                <div className={`text-sm break-words whitespace-pre-wrap ${msg.sender._id === user._id.toString() ? 'text-white' : 'text-gray-300'}`}>
                                    {msg.sender._id === 'ai'
                                        ? WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* INPUT FIELD */}
                    <div className="inputField w-full flex items-center gap-2 bg-[#0a0a0f] p-3 border-t border-gray-800/50">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && send()}
                            className="flex-grow p-3 px-4 bg-[#1a1a24] border border-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:border-[#6D54B6]/50 transition-all"
                            placeholder="Type a message..."
                        />

                        <button
                            onClick={send}
                            className="p-3 px-4 bg-[#6D54B6] hover:bg-[#5d47a3] text-white rounded-xl transition-all shadow-lg shadow-[#6D54B6]/25"
                        >
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>

                </div>


                {/* COLLABORATORS PANEL */}
                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-[#0a0a0f] absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 left-0 z-10`}>
                    <header className='flex justify-between items-center px-4 p-3 bg-[#13131a] border-b border-gray-800/50'>
                        <h1 className='font-semibold text-lg text-white'>Collaborators</h1>

                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 px-3 bg-gray-800/50 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all'>
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>

                    <div className="users flex flex-col gap-1 p-2">
                        {project.users && project.users.map(usr => (
                            <div 
                            key={usr._id}
                            className="user cursor-pointer hover:bg-[#1a1a24] p-3 rounded-xl flex gap-3 items-center transition-all">
                                <div className='w-10 h-10 rounded-xl bg-[#6D54B6] text-white flex items-center justify-center font-semibold'>
                                    {usr.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <h1 className='text-gray-300'>{usr.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* RIGHT SIDE – EXPLORER + EDITOR */}
            <section className="right bg-[#0a0a0f] flex-grow h-full flex">

                <div className="explorer h-full max-w-64 min-w-52 bg-[#13131a] border-r border-gray-800/50">
                    <div className="p-3 border-b border-gray-800/50">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Explorer</h2>
                    </div>
                    <div className="file-tree w-full p-2">
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                                    }}
                                    className={`tree-element cursor-pointer p-2 px-3 flex items-center gap-2 w-full rounded-lg transition-all text-left ${currentFile === file ? 'bg-[#6D54B6]/20 text-[#6D54B6]' : 'text-gray-400 hover:bg-[#1a1a24] hover:text-white'}`}>
                                    <i className="ri-javascript-line text-yellow-400"></i>
                                    <p className='text-sm'>{file}</p>
                                </button>))

                        }
                    </div>

                </div>


                <div className="code-editor flex flex-col flex-grow h-full shrink">

                    <div className="top flex justify-between w-full bg-[#13131a] border-b border-gray-800/50">

                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center gap-2 border-r border-gray-800/50 text-sm transition-all ${currentFile === file ? 'bg-[#0a0a0f] text-white border-t-2 border-t-[#6D54B6]' : 'text-gray-500 hover:text-white'}`}>
                                        <p>{file}</p>
                                    </button>
                                ))
                            }
                        </div>

                        <div className="actions flex gap-2 p-2">
                            <button
                                onClick={async () => {
                                    await webContainer.mount(fileTree)


                                    const installProcess = await webContainer.spawn("npm", [ "install" ])



                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    if (runProcess) {
                                        runProcess.kill()
                                    }

                                    let tempRunProcess = await webContainer.spawn("npm", [ "start" ]);

                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    setRunProcess(tempRunProcess)

                                    webContainer.on('server-ready', (port, url) => {
                                        console.log(port, url)
                                        setIframeUrl(url)
                                    })

                                }}
                                className='flex items-center gap-2 px-4 py-1.5 bg-[#6D54B6] hover:bg-[#5d47a3] text-white rounded-lg text-sm transition-all shadow-lg shadow-[#6D54B6]/25'
                            >
                                <i className="ri-play-fill"></i>
                                Run
                            </button>


                        </div>
                    </div>
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                        {
                            fileTree[ currentFile ] && (
                                <div className="code-editor-area h-full overflow-auto flex-grow bg-[#0a0a0f]">
                                    <pre
                                        className="hljs h-full">
                                        <code
                                            className="hljs h-full outline-none"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                const ft = {
                                                    ...fileTree,
                                                    [ currentFile ]: {
                                                        file: {
                                                            contents: updatedContent
                                                        }
                                                    }
                                                }
                                                setFileTree(ft)
                                                saveFileTree(ft)
                                            }}
                                            dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[ currentFile ].file.contents).value }}
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                            }}
                                        />
                                    </pre>
                                </div>
                            )
                        }
                    </div>

                </div>

                {iframeUrl && webContainer &&
                    (<div className="flex min-w-96 flex-col h-full border-l border-gray-800/50">
                        <div className="address-bar bg-[#13131a] border-b border-gray-800/50">
                            <input type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl} className="w-full p-2 px-4 bg-[#1a1a24] text-gray-300 text-sm outline-none focus:bg-[#1e1e28] transition-all" />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
                    </div>)
                }


            </section>


            {/* ADD USER MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#13131a] p-6 rounded-2xl w-96 max-w-full relative border border-gray-800/50 shadow-2xl shadow-[#6D54B6]/20 mx-4">

                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold text-white'>Add Collaborators</h2>
                            <button onClick={() => setIsModalOpen(false)} className='w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-700 transition-all'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>

                        <div className="users-list flex flex-col gap-1 mb-20 max-h-80 overflow-auto">
                            {users.map(u => (
                                <div
                                    key={u._id}
                                    className={`user p-3 flex gap-3 items-center cursor-pointer rounded-xl transition-all
                                        ${selectedUserId.has(u._id) ? 'bg-[#6D54B6]/20 border border-[#6D54B6]/50' : 'hover:bg-[#1a1a24] border border-transparent'}`}
                                    onClick={() => handleUserClick(u._id)}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold ${selectedUserId.has(u._id) ? 'bg-[#6D54B6] text-white' : 'bg-gray-800 text-gray-400'}`}>
                                        {u.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <h1 className={`text-sm ${selectedUserId.has(u._id) ? 'text-white' : 'text-gray-400'}`}>{u.email}</h1>
                                    {selectedUserId.has(u._id) && (
                                        <i className="ri-check-line ml-auto text-[#6D54B6]"></i>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-4 right-4 px-4 py-3 bg-[#6D54B6] hover:bg-[#5d47a3] text-white rounded-xl font-medium transition-all shadow-lg shadow-[#6D54B6]/25'
                        >
                            Add Collaborators
                        </button>

                    </div>
                </div>
            )}

        </main>
    )
}

export default Project
