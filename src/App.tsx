import { Layout } from './components/Layout';
import { SearchInput } from './components/SearchInput';
import { Dashboard } from './components/Dashboard';
import { useWalletData } from './hooks/useWalletData';
import './App.css';

function App() {
  const { data, loading, error, fetchWalletData } = useWalletData();

  return (
    <Layout>
      <div className="app-header">
        <h1 className="app-title">BaseScan Pro Dashboard</h1>
        <p className="app-subtitle">
          Real-time on-chain analytics for the Base network
        </p>
      </div>

      <SearchInput onSearch={fetchWalletData} isLoading={loading} />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching on-chain data...</p>
        </div>
      )}

      {data && !loading && (
        <Dashboard data={data} />
      )}

      {!data && !loading && !error && (
        <div className="empty-state-hero">
          <p>Enter a wallet address to get started</p>
          <div className="sample-address" onClick={() => fetchWalletData('0xAb0780b44d5A1284E9fce00cF8c4151c84F9a364')}>
            Try sample: 0xAb07...a364
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
