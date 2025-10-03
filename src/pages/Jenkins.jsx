import { useLocation } from 'react-router-dom';

export default function Jenkins() {
  const { state } = useLocation();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jenkins Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Connected to: {state?.url}</p>
        <p>Username: {state?.username}</p>
        {/* Add more Jenkins specific content here */}
      </div>
    </div>
  );
}