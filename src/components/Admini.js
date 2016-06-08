import React from 'react'
import { AdminCreateTest } from './AdminCreateTest'
import { AdminShowTest }   from './AdminShowTest'

export default React.createClass({
  render() {
    return(<div className="commentBox">
              <AdminShowTest />
              <AdminCreateTest />
           </div>)
  }
})
