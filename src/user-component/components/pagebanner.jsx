import React from 'react'

function Pagebanner({title , breadcrumb}) {
    const background = "public/2.webp"
  return (
   <div className="relative bg-cover bg-center h-64 flex items-center justify-center"
   style={{
        backgroundImage: `url(${background})`,
    }}
>
 <div className="absolute inset-0 bg-[#b79141]/90"></div>

      <div className="relative text-center text-white z-10">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-lg mt-2">{breadcrumb}</p>
      </div>
    </div>
  )
}

export default Pagebanner