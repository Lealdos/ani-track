// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Plus, Check, Loader2 } from "lucide-react"
// import { useAuth } from "@/hooks/use-auth"
// import { useToast } from "@/hooks/use-toast"
// import { useRouter } from "next/navigation"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// interface AddToListButtonProps {
//   animeId: number
// }

// export function AddToListButton({ animeId }: AddToListButtonProps) {
//   const { user } = useAuth()
//   const { toast } = useToast()
//   const router = useRouter()
//   const [isAdding, setIsAdding] = useState(false)

//   // In a real app, you would check if the anime is already in any list
//   const [isInList, setIsInList] = useState(false)

//   const handleAddToList = async (listName: string) => {
//     if (!user) {
//       router.push("/login")
//       return
//     }

//     setIsAdding(true)

//     // Simulate API call
//     setTimeout(() => {
//       setIsAdding(false)
//       setIsInList(true)

//       toast({
//         title: "Added to list",
//         description: `Anime added to your "${listName}" list`,
//       })
//     }, 500)
//   }

//   if (isInList) {
//     return (
//       <Button variant="outline" size="sm" className="w-full" disabled>
//         <Check className="mr-2 h-4 w-4" />
//         Added to list
//       </Button>
//     )
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="sm" className="w-full" disabled={isAdding}>
//           {isAdding ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Adding...
//             </>
//           ) : (
//             <>
//               <Plus className="mr-2 h-4 w-4" />
//               Add to list
//             </>
//           )}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => handleAddToList("Watch Later")}>Watch Later</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => handleAddToList("Currently Watching")}>Currently Watching</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => handleAddToList("Completed")}>Completed</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => handleAddToList("Favorites")}>Favorites</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
