import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../App'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import './styles.css'
import io from 'socket.io-client'
// import Lottie from 'react-lottie'
// import animationData from "../animations/typing.json"

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

// { fetchAgain, setFetchAgian }
const SignleChat = () => {
  // state for all the messsages - stores all messages fetched from backend
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice"
  //   }
  // }

  const toast = useToast();

  const {user, selectedChat, setSelectedChat, notification, setNotification} = ChatState();

  const fetchMessages = async() =>{
    if(!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const {data} = await axios.get(`/api/message/${selectedChat._id}`, config);

      setMessages(data);
      // console.log(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: "Fetching Chat Error!",
        description: "Failed to load the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
  }, [])

  useEffect(()=>{
    fetchMessages();

    selectedChatCompare = selectedChat;
  },[selectedChat]);

  // console.log(notification, "-----------------------------");

  useEffect(()=>{
    socket.on('message received', (newMessageReceived)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
        // give notification
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived, ...notification]);
        }
      }
      else {
        setMessages([...messages, newMessageReceived]);
      }
    })
  })

  const sendMessage = async (event) => {
    if(event.key === "Enter" && newMessage){
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            "content-type":"application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");

        const {data} = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);
        // console.log(data);

        socket.emit('new message', data)

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Message Send Error Occured!",
          description: "failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator logic
    if(!socketConnected) return;

    if(!typing){
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if(timeDiff >= timerLength && typing){
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }
  return (
    <>
    {
      selectedChat ? (
        <>
        <Text
          fontSize={{base: "28px", md: "30px"}}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          display="flex"
          justifyContent={{base: "space-between"}}
          alignItems="center"
        >
          <IconButton
            display={{base: 'flex', md: "none"}}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat("")}
          />
          {!selectedChat.isGroupChat ? (
          <>
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
          </>) : (
          <>
            {selectedChat.chatName.toUpperCase()}
            {/* <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgian={setFetchAgian} /> */}
            <UpdateGroupChatModal />
          </>)}
        </Text>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          p={3}
          bg="#E8E8E8"
          width="100%"
          height="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {loading ? <Spinner size="xl" width={20} height={20} alignSelf="center" margin="auto" /> : (
            <div className="messages">
              {/* messages */}
              <ScrollableChat messages={messages} />
            </div>
          )}

          <FormControl onKeyDown={sendMessage} isRequired mt={3} >
            {isTyping ? <div>Typing...</div> : <></>}
            {/* {isTyping ? <Lottie 
              options={defaultOptions}
              width={70}
              style={{marginBottm: 15, marginLeft: 0}}
            /> : <></>} */}
            <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message..." onChange={typingHandler} value={newMessage} />
          </FormControl>
        </Box>
        </>
      ) : (
        <Box display='flex' alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click On A User To Start Chatting.
          </Text>
        </Box>
      )
    }
    </>
  )
}

export default SignleChat