import Image from "./Image";

const Comment = () => {
    return(
        <div className="p-4 bg-slate-50  dark:text-black   rounded-xl mb-8">
          <div className="flex items-center gap-4">
         <Image
         src="myphoto.jpg"
         className="w-10 rounded-full object-cover"
         w="40"
         />
         <span className="font-medium text-black">Smart Sunday</span>
         <span className="text-sm text-gray-500"> 2 days ago</span> 
        </div>  
        <div className="mt-4">
        <p className="text-black">Whether you’re giving a card to someone or dreaming up the perfect poster,
             the right funny quote will make it a memorable gift for anyone who reads it 
             and laughs. Humorous quotes about life and work help us chuckle our way out 
             of stress and monotony.
            Funny quotes often have more than one meaning, too. Read between the 
            lines and find the perfect quote (and subtext) to make your next project
             more fun for you and everyone else.
             </p>
        </div>

        </div>
    )
}
export default Comment;