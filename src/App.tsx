import React, { Suspense } from 'react'
import Loading from '@/components/Loading'
import Routes from './routes'

function App() {
    return (
        <div className="App">
            <Suspense fallback={<Loading />}>
                <Routes />
            </Suspense>
        </div>
    )
}

export default App
