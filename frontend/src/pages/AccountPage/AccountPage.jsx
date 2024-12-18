import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../MainPage/components/Header/Header';
import { FaEdit, FaTrash, FaKey} from 'react-icons/fa';
import EditDataModal from './components/EditDataModal/EditDataModal';
import PasswordModal from './components/PasswordModal/PasswordModal';
import DeleteAccountModal from './components/DeleteAccountModal/DeleteAccountModal';
import OrdersSection from './components/OrdersSection/OrdersSection';
import './AccountPage.css';
// import { handleTokenExpiration } from '../../utils/handleTokenExpiration';
// import { checkTokenExpiration } from '../../utils/tokenInterceptor';
import { isAuthenticated, getToken } from '../../utils/auth';

export default function AccountPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);

  const fetchUserData = async () => {
    try {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }

      const token = getToken();
      const response = await fetch('http://localhost:8000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else if (response.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      console.log('User data:', userData);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/rentals/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Pobrane zamówienia:", data);
        const now = new Date();
        
        setActiveOrders(data.filter(order => new Date(order.end_date) >= now));
        setPastOrders(data.filter(order => new Date(order.end_date) < now));
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleEditSubmit = async (updatedData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/api/users/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: updatedData.email,
          firstname: updatedData.firstname,
          lastname: updatedData.lastname,
          phonenumber: updatedData.phonenumber,
          street: updatedData.street,
          house_number: updatedData.house_number, 
          apartment_number: updatedData.apartment_number,
          postal_code: updatedData.postal_code, 
          city: updatedData.city
        })
      });

      if (response.ok) {
        await fetchUserData();
        setIsEditModalOpen(false);
      } else {
        const data = await response.json();
        console.error('Error:', data.detail || 'Błąd podczas aktualizacji danych');
        throw new Error(data.detail || 'Błąd podczas aktualizacji danych');
      }
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Błąd podczas aktualizacji danych');
    }
  };

  const handlePasswordChange = async (oldPassword, newPassword) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/users/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword
      })
    });

    if (response.ok) {
      alert('Hasło zostało zmienione pomyślnie');
    } else {
      const data = await response.json();
      throw new Error(data.detail || 'Błąd podczas zmiany hasła');
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/api/users/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Błąd podczas usuwania konta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="account-page">
      <Header />
      <div className="account-container">
        <div 
          className="account-content"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ cursor: 'pointer' }}
        >
          <div className="account-details">
            <div className="user-name">
              {userData?.firstname} {userData?.lastname}
            </div>
            <div className="user-email">
              {userData?.email}
            </div>
          </div>

          <div className={`account-actions ${isMenuOpen ? 'open' : ''}`}>
            <div className="actions-dropdown">
              <button 
                className="edit-button" 
                onClick={() => setIsEditModalOpen(true)}
              >
                <FaEdit /> Edytuj dane
              </button>
              <button 
                className="password-button"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <FaKey /> Zmień hasło
              </button>
              <button 
                className="delete-button" 
                onClick={handleDeleteClick}
              >
                <FaTrash /> Usuń konto
              </button>
            </div>
          </div>
        </div>
        <EditDataModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={userData}
        />

        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordChange}
        />

        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          userEmail={userData?.email || ''}
        />
      </div>
      <OrdersSection 
          activeOrders={activeOrders}
          pastOrders={pastOrders}
        />
    </div>
  );
}
