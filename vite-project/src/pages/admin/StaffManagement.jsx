import React, { useState, useEffect } from 'react';
import './StaffManagement.css';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: '', position: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch staff data from an API here
    const dummyStaff = [
      { id: 1, name: 'John Doe', position: 'Veterinarian', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', position: 'Technician', email: 'jane@example.com' },
    ];
    setStaff(dummyStaff);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.position && newStaff.email) {
      setStaff([...staff, { ...newStaff, id: Date.now() }]);
      setNewStaff({ name: '', position: '', email: '' });
    }
  };

  const handleEditStaff = (id) => {
    setEditingId(id);
    const staffToEdit = staff.find(s => s.id === id);
    setNewStaff(staffToEdit);
  };

  const handleUpdateStaff = () => {
    setStaff(staff.map(s => s.id === editingId ? { ...newStaff, id: editingId } : s));
    setEditingId(null);
    setNewStaff({ name: '', position: '', email: '' });
  };

  const handleDeleteStaff = (id) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  return (
    <div className="staff-management">
      <form className="staff-form">
        <input
          type="text"
          name="name"
          value={newStaff.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="position"
          value={newStaff.position}
          onChange={handleInputChange}
          placeholder="Position"
          required

        />
        <input
          type="email"
          name="email"
          value={newStaff.email}
          onChange={handleInputChange}
          placeholder="Email"
          required

        />
        {editingId ? (
          <button onClick={handleUpdateStaff}>Update Staff</button>
        ) : (
          <button onClick={handleAddStaff}>Add Staff</button>
        )}
      </form>
      <form action="
      ">
        <table className="staff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.position}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleEditStaff(s.id)}>Edit</button>
                <button onClick={() => handleDeleteStaff(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </form>
    </div>
  );
};

export default StaffManagement;