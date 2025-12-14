import { ReactNode } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import './LayoutAdmin.css'

interface LayoutAdminProps {
  children: ReactNode
}

const LayoutAdmin = ({ children }: LayoutAdminProps) => {
  return (
    <div className="layout-admin">
      <Sidebar />
      <main className="layout-admin-content">
        {children}
      </main>
    </div>
  )
}

export default LayoutAdmin

