import { IMessage } from "@/store/chat-store";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Image } from "lucide-react"
import { AvatarImage } from "../ui/avatar";

type Chatbubbleavatarprops={
  isGroup:boolean;
  message:IMessage;
  isMember:boolean;
}


const Chatbubbleavatart = ({isGroup,message,isMember}:Chatbubbleavatarprops) => {
  if(!isGroup){
    return null;
  }
  return (
    <div>
      <Avatar>
        
        <AvatarImage src={message.sender?.image} className="rounded-full object-cover w-8 h-8"/>
        <AvatarFallback className="w-8 h-8">
          <div className="animate-pulse bg-gray-tertiary rounded-full"></div>
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

export default Chatbubbleavatart
