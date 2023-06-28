import { TaskIndex } from './views/task-index'
import { AppHeader } from './cmps/app-header'
import { Routes, Route } from 'react-router-dom'

function App() {
	return (
		<div className='main-app'>
			<AppHeader />
			<main className='main-container'>
				<Routes>
					<Route path='/' element={<TaskIndex />} > </Route>
				</Routes>
			</main>
		</div>
	)
}

export default App
