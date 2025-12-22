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
        <main className='h-screen w-screen flex'>

            {/* LEFT PANEL */}
            <section className="left relative flex flex-col h-screen w-[35%] min-w-[22rem] bg-slate-300 px-4">
                <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100'>
                    <button className='flex gap-2' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill mr-1"></i>
                        <p>Add collaborator</p>
                    </button>

                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2'>
                        <i className="ri-group-fill"></i>
                    </button>
                </header>


                {/* CHAT */}
                <div className="conversation-area flex-grow flex flex-col h-full pt-4">

                    <div
                        ref={messageBox}
                        className="message-box flex-grow flex flex-col gap-3 overflow-auto scrollbar-hide py-3"
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`
                                    ${msg.sender._id === user._id.toString() ? 'self-end' : 'self-start'} 
                                    bg-white p-3 rounded-lg shadow-sm max-w-[75%]
                                `}
                            >
                                <small className='text-xs text-gray-500'>
                                    {msg.sender.email}
                                </small>

                                <div className='text-sm break-words whitespace-pre-wrap'>
                                    {msg.sender._id === 'ai'
                                        ? WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* INPUT FIELD */}
                    <div className="inputField w-full flex items-center gap-2 bg-gray-100 p-3 border-t border-gray-300">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-grow p-2 px-3 bg-white border border-gray-300 rounded-md outline-none"
                            placeholder="Enter message"
                        />

                        <button
                            onClick={send}
                            className="p-2 px-3 bg-slate-900 text-white rounded-md"
                        >
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>

                </div>


                {/* COLLABORATORS PANEL */}
                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                    <header className='flex justify-between items-center px-4 p-2 bg-slate-200'>
                        <h1 className='font-semibold text-lg'>Collaborators</h1>

                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2'>
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>

                    <div className="users flex flex-col gap-2">
                        {project.users && project.users.map(usr => (
                            <div 
                            key={usr._id}
                            className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">
                                <div className='aspect-square rounded-full p-5 bg-slate-600 text-white'>
                                    <i className="ri-user-fill"></i>
                                </div>
                                <h1 className='font-semibold text-lg'>{usr.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* RIGHT SIDE – EXPLORER + EDITOR */}
                        <section className="right bg-red-50 flex-grow h-full flex">

                <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
                    <div className="file-tree w-full">
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                                    }}
                                    className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full">
                                    <p
                                        className='font-semibold text-lg'
                                    >{file}</p>
                                </button>))

                        }
                    </div>

                </div>


                <div className="code-editor flex flex-col flex-grow h-full shrink">

                    <div className="top flex justify-between w-full">

                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                        <p
                                            className='font-semibold text-lg'
                                        >{file}</p>
                                    </button>
                                ))
                            }
                        </div>

                        <div className="actions flex gap-2">
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
                                className='p-2 px-4 bg-slate-300 text-white'
                            >
                                run
                            </button>


                        </div>
                    </div>
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                        {
                            fileTree[ currentFile ] && (
                                <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
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
                    (<div className="flex min-w-96 flex-col h-full">
                        <div className="address-bar">
                            <input type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl} className="w-full p-2 px-4 bg-slate-200" />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full"></iframe>
                    </div>)
                }


            </section>


            {/* ADD USER MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">

                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>

                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(u => (
                                <div
                                    key={u._id}
                                    className={`user p-2 flex gap-2 items-center cursor-pointer hover:bg-slate-200 
                                        ${selectedUserId.has(u._id) ? 'bg-slate-200' : ''}`}
                                    onClick={() => handleUserClick(u._id)}
                                >
                                    <div className='rounded-full p-5 bg-slate-600 text-white'>
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{u.email}</h1>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'
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
