import {useState, useEffect, useContext, useRef} from 'react'
import axios from 'axios'
import { UserContext } from '../context/UserContext'
import Logo from './Logo'
import Contact from './Contact'

const Chat = () => {
  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo/>
          <Contact username={"user1"} id={'65a8bcd5c85a5b0178c98a8e'} online={true} selected={true}/>
          <Contact username={"user2"} id={'65a8bcaaf1cff58d1a511762'} online={false} selected={false}/>
        </div>
        <div className="p-2 text-center flex items-center justify-center">
          <span className="mr-2 text-sm text-gray-600 flex items-center">
            <svg data-slot="icon" 
            className='w-5 h-7' 
            fill="none" 
           stroke-width="1.5" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg" 
            aria-hidden="true">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z">
              </path>
          </svg>
            Username
          </span>
          
          <button className="text-sm bg-blue-100 py-1 px-2 text-gray-500 border rounded-md hover:bg-red-500 hover:text-black">
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col bg-gray-200 w-2/3 p-2">
        <div className="flex-grow">
          <div className="relative h-full flex flex-grow items-center justify-center">
            <div className="text-gray-400">
              &larr; Select a person form sidebar
            </div>
          </div>
        </div>
        <from className="flex gap-2 w-auto ">
          <input type="text" 
          placeholder='Type your message' 
          className="bg-wwhite flex-grow border p-2 rounded-lg" />  
          <label className="bg-black p-2 text-gray-400 cursor-pointer rounded-md border border-blue-200 w-auto h-auto hover:bg-white hover:text-black">
            <input type="file" className="hidden" />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
            </svg>
          </label>
          <button type="submit" className=" bg-black p2 text-white rounded-md w-8 hover:bg-white hover:text-black">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-6 h-6">
              <path strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
          </button>
        </from>
      </div>
    </div>
  )
}

export default Chat