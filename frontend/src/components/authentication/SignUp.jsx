import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import { useHistory } from 'react-router-dom'

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('')
  const [pic, setPic] = useState("")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const history = useHistory()

  const handleClick = () => setShow(!show);

  const postDetails = (pic) => {
    setLoading(true)
    if(pic === undefined){
      toast({
          title: 'Please Select An Image!.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false)
      return;
    }

    if(pic.type === "image/jpeg" || pic.type === "image/png"){
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "MERN Chat App");
      data.append("cloud_name", "dnwbz1xtg");
      fetch("https://api.cloudinary.com/v1_1/dnwbz1xtg/image/upload", {
        method: "post",
        body: data
      }).then((res) => res.json())
      .then(data => {
        setPic(data.url.toString());
        // console.log(data);
        setLoading(false)
      })
      .catch((err)=>{
        console.log(err);
        setLoading(false)
      })
    }
    else{
      toast({
          title: 'Please Select An Image (.jpeg or .png).',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        setLoading(false)
        return;
    }
  }

  const submitHandle = async () => {
    setLoading(true);
    if(!name || !email || !password || !confirmpassword){
      toast({
        title: "Please Fill All The Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if(password !== confirmpassword){
      toast({
        title: "Passwords Do Not Match",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return;
    }

    try {
      const config = {
        Headers: {
          "Content-type" : "Application/json",
        }
      }

      const { data } = await axios.post("/api/user", {name, email, password, pic}, config);
      toast({
        title: "Registration Successsful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);

      history.push('/chats')
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false);
    }
  }

  return (
    <VStack spacing='5px'>
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name' onChange={(e)=>{
              setName(e.target.value)
            }} />
        </FormControl>

        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input type='email' placeholder='Enter Your Email' onChange={(e)=>{
              setEmail(e.target.value)
            }} />
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder='Enter Your Password'
                onChange={(e)=>{ setPassword(e.target.value) }}
              />
              <InputRightElement width="4.5rem">
                <Button h='1.75rem' size='5m' onClick={() => handleClick()} bg='transparent' p={2}>
                  { show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='confirmPassword' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder='Confirm Your Password'
                onChange={(e)=>{ setConfirmpassword(e.target.value) }}
              />
              <InputRightElement width="4.5rem">
                <Button h='1.75rem' size='5m' onClick={handleClick} bg='transparent' p={2}>
                  { show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='pic'>
          <FormLabel>Upload your Picture</FormLabel>
          <Input
            type='file'
            p={1.5}
            accept='image/*'
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>

        <Button 
          type='submit'
          colorScheme='teal'
          width='100%'
          style={{marginTop: 15}}
          onClick={submitHandle}
          isLoading={loading}
        >
          Sign Up
        </Button>
    </VStack>
  )
}

export default SignUp