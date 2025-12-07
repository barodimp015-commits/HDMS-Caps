import type React from "react"

import { RoleBasedRedirect } from "@/components/Auth/role-based-redirect"
import { Navbar } from "@/components/researcher-navbar"

export default function ResearcherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleBasedRedirect allowedRoles={["researcher"]}>
     <div className="min-h-screen bg-background">
         <Navbar />
         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           {children}
         </main>
         <footer className="border-t bg-muted/50 mt-16">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div>
                 <h3 className="font-semibold mb-3">MSU Herbarium</h3>
                 <p className="text-sm text-muted-foreground">
                   Digitizing plant specimens for research, conservation, and education.
                 </p>
               </div>
               <div>
                 <h3 className="font-semibold mb-3">Quick Links</h3>
                 <ul className="space-y-2 text-sm text-muted-foreground">
                   <li>
                     <a href="/visitor/specimens" className="hover:text-foreground">
                       Browse Specimens
                     </a>
                   </li>
                   <li>
                     <a href="/visitor/map" className="hover:text-foreground">
                       Explore Map
                     </a>
                   </li>
                   <li>
                     <a href="/about" className="hover:text-foreground">
                       About Us
                     </a>
                   </li>
                 </ul>
               </div>
               <div>
                 <h3 className="font-semibold mb-3">Access</h3>
                 <p className="text-sm text-muted-foreground mb-2">You're browsing as a guest with read-only access.</p>
                 <p className="text-sm text-muted-foreground">Login for full researcher capabilities.</p>
               </div>
             </div>
             <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
               <p>&copy; 2025 Mindanao State University Herbarium. All rights reserved.</p>
             </div>
           </div>
         </footer>
       </div>
    </RoleBasedRedirect>
  )
}
