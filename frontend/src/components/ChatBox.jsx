import { Box } from '@chakra-ui/react'
import React from 'react'
import {ChatState} from "../App"
import SignleChat from './SignleChat'

// { fetchAgain, setFetchAgain }
const ChatBox = () => {

  const {selectedChat} = ChatState()

  return (
    <Box 
      display={{base: selectedChat ? "flex" : "none", md: "flex"}}
      alignItems="center"
      flexDirection="column"
      p={3}
      bg="white"
      w={{base: "100%", md: "68%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      {/* <SignleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> */}
      <SignleChat />
    </Box>
  )
}

export default ChatBox 