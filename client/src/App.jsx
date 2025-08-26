import React from "react"
import { Button } from "@/components/ui/button";

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Button onClick={() => alert("Button clicked!")}>Click me</Button>
    </>
  )
}

export default App
