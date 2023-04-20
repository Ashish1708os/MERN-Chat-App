// import { useContext, useState, createContext, useEffect } from "react";
// import { useHistory } from "react-router-dom";

// // search for context api for better understanding
// const ChatContext = createContext();

// const ChatProvider = ({ childern }) => {
//   const [user, setUser] = useState();
//   const history = useHistory();

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));

//     setUser(userInfo);

//     if (!userInfo) {
//       history.push("/");
//     }
//   }, [history]);
//   return (
//     <ChatContext.Provider value={{ user, setUser }}>
//       {childern}
//     </ChatContext.Provider>
//   );
// };

// export const ChatState = () => {
//   return useContext(ChatContext);
// };

// export default ChatProvider;

import { createContext } from "react";

export const ChatContext = createContext();
