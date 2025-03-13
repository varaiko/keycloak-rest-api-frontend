import { NotFoundPage } from "../pages/404notFound"
import { Account } from "../pages/Account"
import { Home } from "../pages/Home"
import { Stories } from "../pages/Stories"
import CreateNewStory from "../pages/CreateNewStory"
import ChangeStories from "../pages/ChangeStories"
import { SpecificStory } from "../pages/SpecificStory"

export const nav = [
     { path:     "/",         name: "Home",        element: <Home />,       isMenu: true,     isPrivate: false },
     { path:     "/account",  name: "Account",     element: <Account />,    isMenu: true,     isPrivate: true },
     { path:     "/createnewstory",  name: "CreateNewStory",     element: <CreateNewStory />,    isMenu: false,     isPrivate: true },
     { path:     "/stories",  name: "Stories",     element: <Stories />,    isMenu: true,     isPrivate: true },
     { path:     "/story/*",  name: "SpecificStory",     element: <SpecificStory />,    isMenu: false,     isPrivate: true },
     { path:     "/changestory/*",  name: "Change story",     element: <ChangeStories />,    isMenu: false,     isPrivate: true },
     { path:     "/*",  name: "NotFoundPage",     element: <NotFoundPage />,    isMenu: false,     isPrivate: false }
]