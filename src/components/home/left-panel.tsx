import { ListFilter, LogOut, MessageSquareDiff, Search, User } from "lucide-react";
import { Input } from "../ui/input";
import ThemeSwitch from "./theme-switch";

// import { conversations } from "@/dummy-data/db";
 
import Conversation from "./converastion";

import { UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/clerk-react";
import UserListDialog from "./user-list-dialog";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const LeftPanel = () => {


	const tempConversation = {
		_id: "conversation1",
		groupImage: null, // If it's a group conversation, set a group image URL here
		image: "/images/default-avatar.png", // If it's an individual conversation, set an image URL here
		groupName: null, // If it's a group conversation, set a group name here
		name: "John Doe", // For individual conversations
		lastMessage: {
		  _id: "message1",
		  messageType: "text", // Could be "text", "image", or "video"
		  content: "Hey there! How's it going?", // Message content
		  sender: "user1", // ID of the user who sent the last message
		  _creationTime: new Date().toISOString(), // Timestamp of the last message
		},
		_creationTime: new Date().toISOString(), // Timestamp of when the conversation was created
		isGroup: false, // Set to true if it's a group conversation
		isOnline: true, // Online status of the conversation (for individual chats)
	  };
	// const conversations = [];
	const {isAuthenticated} = useConvexAuth();
	const conversations = useQuery(api.conversation.getMyConversation,
		isAuthenticated?undefined:"skip"
	);
	return (
		// <div className='w-1/4 border-gray-600 border-r'>
		<div className='w-1/4 border-gray-600 border-r rounded-[10px]'>
			<div className='sticky top-0 bg-left-panel z-10'>
				{/* Header */}
				<div className='flex justify-between bg-gray-primary p-3 items-center'>
					 
					 <UserButton/>
					<div className='flex items-center gap-3'>
						{isAuthenticated && < UserListDialog/>}
						{/* <MessageSquareDiff size={20} /> TODO: This line will be replaced with <UserListDialog /> */}
						 
						{/* <LogOut size={20} className='cursor-pointer' /> */}
					</div>
				</div>
				<div className='p-3 flex items-center'>
					{/* Search */}
					<div className='relative h-10 mx-3 flex-1'>
						<Search
							className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10'
							size={18}
						/>
						<Input
							type='text'
							placeholder='Search or start a new chat'
							className='pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent'
						/>
					</div>
				</div>
			</div>

			{/* Chat List */}
			<div className='my-3 flex flex-col gap-0 max-h-[80%] overflow-auto'>
			 
				{conversations?.map((conversation)=>(
					<Conversation key={conversation._id} conversation={conversation} />
				))}
				{conversations?.length === 0 && (
					<>
						<p className='text-center text-gray-500 text-sm mt-3'>No conversations yet</p>
						<p className='text-center text-gray-500 text-sm mt-3 '>
							We understand {"you're"} an introvert, but {"you've"} got to start somewhere 😊
						</p>
					</>
				)}
			</div>
		</div>
	);
};
export default LeftPanel;