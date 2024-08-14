import React from 'react'

export default function Sidebaritems({ name, active, handleClick }) {
  return (
    <div>
      <button className={`sidebar-item ${active ? 'active' : ''}`} onClick={handleClick}>{ name }</button>
    </div>
  )
}
