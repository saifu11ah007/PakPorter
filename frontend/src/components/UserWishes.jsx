import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserWishes = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's wishes
  useEffect(() => {
    const fetchWishes = async () => {
      try {
        setLoading(true);
        // Assuming the API endpoint filters wishes by the logged-in user
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/wish`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming JWT token is stored in localStorage
          },
        });
        setWishes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching wishes');
        setLoading(false);
      }
    };

    fetchWishes();
  }, []);

  // Handle delete wish
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this wish?')) {
      try {
        await axios.delete(`/api/wish/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setWishes(wishes.filter((wish) => wish._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting wish');
      }
    }
  };

  // Handle update wish (basic implementation - redirects to an update page)
  const handleUpdate = (id) => {
    // In a full implementation, this could redirect to an update form
    alert('Update functionality would open an edit form for wish ID: ' + id);
    // You could use React Router to navigate to an update page
    // history.push(`/wish/${id}/edit`);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Wishes</h1>
      {wishes.length === 0 ? (
        <p className="text-gray-500">You haven't created any wishes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishes.map((wish) => (
            <div
              key={wish._id}
              className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{wish.title}</h2>
              {wish.images && wish.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {wish.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${wish.title} ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-4">No images available</p>
              )}
              <p className="text-gray-600 mb-2">{wish.description}</p>
              <p className="text-gray-500 mb-2">Price: ${wish.basePrice}</p>
              <p className="text-gray-500 mb-4">
                Deadline: {new Date(wish.deliveryDeadline).toLocaleDateString()}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleUpdate(wish._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(wish._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserWishes;