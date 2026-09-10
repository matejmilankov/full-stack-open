import { useState } from 'react'
import { Statistics } from './Statistics'
import { Button } from './Button'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

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

      <Button 
        text="good"
        onClick={handleGoodClick}
      />
      <Button 
        text="neutral"
        onClick={handleNeutralClick}
      />
      <Button 
        text="bad"
        onClick={handleBadClick}
      />


      <h1>statistics</h1>
      <Statistics 
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}

export default App