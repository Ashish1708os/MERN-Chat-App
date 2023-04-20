import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../App'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({messages}) => {
    const {user} = ChatState();
  return (
    <ScrollableFeed>
        {messages && messages.map((message, index)=>{
            return <div style={{display: "flex"}} key={message._id}>
                {
                    (isSameSender(messages, message, index, user._id)
                    || isLastMessage(messages, index, user._id)
                    ) && (
                        // <Tooltip label={message.sender.name} placement='botteom-start' hasArrow>
                        //     <Avatar
                        //       mt="7px"
                        //       mr={1}
                        //       size="sm"
                        //       cursor="pointer"
                        //       name={message.sender.name}
                        //       src={message.sender.pic}
                        //     />
                        // </Tooltip>
                        <Avatar
                              mt="7px"
                              mr={1}
                              size="sm"
                              cursor="pointer"
                              name={message.sender.name}
                              src={message.sender.pic}
                            />
                    )
                }
                <span style={{
                  backgroundColor: `${
                    message.sender.id === user._id ? "#95d1f4" : "#B9F5D0"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, message, index, user._id),
                  marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10,
                }}>
                  {message.content}
                </span>
            </div>
        })}
    </ScrollableFeed>
  )
}

export default ScrollableChat