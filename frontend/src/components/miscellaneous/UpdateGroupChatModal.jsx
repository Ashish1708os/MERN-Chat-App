import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../App';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

// {fetchAgain, setFetchAgain}
const UpdateGroupChatModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ groupChatName, setGroupChatName ] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameloading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleAddUser = async (user1) => {
    if(selectedChat.users.find((u) => u._id === user1._id)){
      toast({
        title: "User Already In Group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return;
    }

    if(selectedChat.groupAdmin._id !== user._id){
      toast({
        title: "Only Admin Can Add Someone!",
        Status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const {data} = await axios.put('/api/chat/groupadd', {
        chatId: selectedChat._id,
        userId: user1._id,
      }, config);

      setSelectedChat(data);
      // setFetchAgain(!fetchAgain);
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
    }
  }

  const handleDelete = async (user1)=> {
    // if(selectedChat.groupAdmin._id !== user._id && user1._id === user._id){
    //   toast({
    //     title: "Only Admins Can Remove Someone!",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom"
    //   });
    //   return;
    // }

    if(selectedChat.groupAdmin._id !== user._id){
      toast({
        title: "Only Admins Can Remove Someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    if(user1._id === user._id){
      toast({
        title: "You can not remove your self!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    try {
      setLoading(true);
      const config = { 
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.put('/api/chat/groupremove', {
        chatId: selectedChat._id,
        userId: user1._id,
      }, config);

      user1._id === user.id ? setSelectedChat() : setSelectedChat(data);
      // setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false)
    }

  }

  const handleRename = async () => {
    if(!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.put('/api/chat/rename', {
        chatId: selectedChat._id,
        chatName: groupChatName
      }, config)
      // console.log(data)
      setSelectedChat(data);
      // setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setRenameLoading(false);

      setGroupChatName("")
    }
  }
  
  const handleSearch = async (query) => {
    setSearch(query);
    if(!query){
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log(data);
      setLoading(false)
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed To Load The Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      });
      setLoading(false)
    }
  }

  

  const handleRemove = async (user1) => {
    if(selectedChat.groupAdmin._id === user._id){
      toast({
        title: "Admins Can not Leave The Group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    try {
      setLoading(true);
      const config = { 
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.put('/api/chat/groupremove', {
        chatId: selectedChat._id,
        userId: user._id,
      }, config);

      user1._id === user.id ? setSelectedChat() : setSelectedChat(data);
      // setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false)
    }
  }


  return (
    <>
      <IconButton display={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box >
              {selectedChat.users.map((user) => {
                return <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)} />
              })}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e)=> setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme='teal'
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >Update</Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add User To Group'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (<Spinner size="lg" />) : (
              searchResult?.map((user) => {
                return <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal