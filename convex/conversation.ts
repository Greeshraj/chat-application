import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createConversation=mutation({
    args:{
        participants:v.array(v.id("users")),
        isGroup:v.boolean(),
        groupName:v.optional(v.string()),
        groupImage:v.optional(v.id("_storage")),
        admin:v.optional(v.id("users")),
    },
    handler:async(ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("Unauthorized");
        }
        const existingConversation = await ctx.db
        .query("conversations")
        .filter((q)=>
            q.or(
                q.eq(q.field("participants"),args.participants),
                q.eq(q.field("participants"),args.participants.reverse())
            )
        ).first();    

        if(existingConversation){
            return existingConversation._id;
        }

        let groupImage;
        if(args.groupImage){
            groupImage=(await ctx.storage.getUrl(args.groupImage)) as string;
        
        }
        console.log("in the function",args);
        const conversationId = await ctx.db.insert("conversations",{
            participants:args.participants,
            isGroup:args.isGroup,
            groupName:args.groupName,
            groupImage,
            admin:args.admin 
        }

        )
        return conversationId;
    },
})

export const getMyConversation = query({
    args:{},
    handler: async (ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("Unauthorized");
        }
        const user = await ctx.db.query("users")
        .withIndex("by_tokenIdentifier",q=>q.eq("tokenIdentifier",identity.tokenIdentifier)).unique();
        if(!user){
            throw new ConvexError("Userr Not Found");
        }
        const conversation = await ctx.db.query("conversations").collect();

        const myConverasation = conversation.filter((conversation)=>{
            return conversation.participants.includes(user._id);
        });

        const conversationswithdetails = await Promise.all(
            myConverasation.map(async(conversation)=>{

                let userDetails = {};
                if(!conversation.isGroup){
                    const otherUserId = conversation.participants.find((participant)=>participant !== user._id);
                    const userProfile =  await ctx.db.query("users").filter((q)=>q.eq(q.field("_id"),otherUserId)).take(1);
                    userDetails = userProfile;
                }
                const lastMessage = await ctx.db.query("messages")
                .filter((q)=>q.eq(q.field("conversation"),conversation._id))
                .order("desc")
                .take(1);

                return {
                    ...userDetails,
                    ...conversation,
                    lastMessage:lastMessage[0] || null,
                }
            })
        )
        return conversationswithdetails;
    }
})

export const generateUploadUrl = mutation(async (ctx)=>{
    return await ctx.storage.generateUploadUrl();
})
