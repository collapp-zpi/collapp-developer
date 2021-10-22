import React, { useState } from 'react'

const Client = () => {
  const [data, setData] = useState(0)

  return (
    <div onClick={() => setData(data + 1)}>
      Test {[...new Array(data)].map(() => '!').join('')}
    </div>
  )
}

export default Client
