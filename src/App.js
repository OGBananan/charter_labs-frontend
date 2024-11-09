import React, { useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from './firebase';  // Import the Firebase helper functions

const App = () => {
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [notification, setNotification] = useState(null);  // State for managing notification
  const [fcmToken, setFcmToken] = useState(null);  // State for storing FCM token

  // // Request Firebase Cloud Messaging token when the component loads
  // useEffect(() => {
  //   requestForToken(setFcmToken);
  // }, []);

  // // Listen for Firebase Cloud Messaging notifications
  // useEffect(() => {
  //   const getNotifications = async () => {
  //     const payload = await onMessageListener();  // Wait for a new message
  //     console.log('Message received:', payload);
  //     const { from, to, value } = payload.data || {};  // Assuming your FCM message has these fields
  //     setNotification({
  //       message: `${value} USDC from ${from} to ${to}`,
  //     });
  //   };

  //   getNotifications();
  // }, []);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const fetchTransactions = async (targetAddress) => {
    try {
      const response = await fetch(`https://charter-labs-test.onrender.com/transactions`);
      const data = await response.json();
      setTransactions(data.transactions);  // Assuming the response contains a `transactions` array
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleStartTracking = async () => {
    console.log('Start tracking address:', address);
    setIsTracking(true);
    
    // Notify the backend to track the transactions for the address
    await fetch(`https://charter-labs-test.onrender.com/track_transactions?address=${address}`);
    fetchTransactions(address);  // Fetch transactions immediately after tracking starts
  };

  // Polling to fetch new transactions every minute
  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        if (address) {
          fetchTransactions(address);
        }
      }, 60000); // 60 seconds interval
    }
    return () => clearInterval(interval);
  }, [isTracking, address]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Form for entering target address */}
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Track USDC Transfers</h2>
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          onClick={handleStartTracking}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        >
          Start Tracking
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="mt-6 w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <ul className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100">
                <div className="flex-1">
                  <span className="text-gray-600">From: <strong className="text-blue-600">{transaction.from_address}</strong></span>
                  <br />
                  <span className="text-gray-600">To: <strong className="text-blue-600">{transaction.to_address}</strong></span>
                </div>
                <div className="text-gray-800 font-semibold text-xl">{transaction.value} USDC</div>
              </li>
            ))
          ) : (
            <li className="text-gray-600">No transactions found.</li>
          )}
        </ul>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 bg-green-500 text-white rounded-lg shadow-lg">
          <span className="font-semibold">New Transfer Alert!</span>
          <p className="mt-2">{notification.message}</p>
        </div>
      )}
    </div>
  );
};

export default App;
