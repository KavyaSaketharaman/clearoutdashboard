// src/components/layout/index.tsx
import Header from "./Header"  
import { Outlet } from "react-router-dom"

const AppLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
)

export default AppLayout