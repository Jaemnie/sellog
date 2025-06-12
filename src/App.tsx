import { Header } from './assets/common'
import './App.css'

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header title="Sellog" />
      
      {/* 헤더가 fixed이므로 padding-top 추가 */}

    </div>
  )
}

export default App
