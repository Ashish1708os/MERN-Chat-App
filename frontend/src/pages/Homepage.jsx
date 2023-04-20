import React from 'react'
import {Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import SignUp from '../components/authentication/SignUp'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'

const Homepage = () => {
  const history = useHistory();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if(user){
      history.push("/chats")
    }
  }, [history])

  return (
    <Container maxW={'xl'} mb='10' centerContent>
      <Box 
        d='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text fontSize='4xl' fontFamily='Work sans' color='black' textAlign='center'>Talk-a-tive</Text>
      </Box>
      <Box 
        bg='white'
        w='100%'
        p={4}
        borderRadius='lg'
        borderWidth='1px'
      >
        <Tabs variant='soft-rounded' colorScheme='teal'>
          <TabList mb='1em'>
            <Tab w='50%'>Login</Tab>
            <Tab w='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage