import React from "react"
import PipetteGrid from "./PipetteGrid"

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pipette Configuration and Tip Rack</h1>
      </header>
      <main>
        <PipetteGrid />
      </main>
    </div>
  )
}

export default App
