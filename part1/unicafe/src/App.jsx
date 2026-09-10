import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad;
  const avg = total === 0 ? 0 : (good * 1 + neutral * 0 + bad * (-1)) / total;
  const positive = total === 0 ? `0%` : `${good / total * 100}%`;

  const handleGoodClick = () => {
    setGood(prev => prev + 1);
  }

  const handleNeutralClick = () => {
    setNeutral(prev => prev + 1);
  }

  const handleBadClick = () => {
    setBad(prev => prev + 1);
  }

  return (
    <div>
      <h1>give feedback</h1>

      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>

      <h1>statistics</h1>

      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {avg}</p>
      <p>positive {positive}</p>
    </div>
  )
}

export default App