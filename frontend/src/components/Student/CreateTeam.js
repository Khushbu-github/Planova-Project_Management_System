import React, { useState, useEffect } from 'react';
import { handleError, handleSuccess } from '../../utils';
// Removed CSS import as we're using inline styles

function CreateTeam() {
  const [name, setName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [availableStudents, setAvailableStudents] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available students and teachers when component mounts
  useEffect(() => {
    fetchAvailableStudents();
    fetchAvailableTeachers();
  }, []);

  const fetchAvailableStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/available-students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Filter out the current user from the list
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const filteredStudents = data.students.filter(student => 
          student._id !== currentUser.id
        );
        setAvailableStudents(filteredStudents);
      } else {
        handleError(data.message || 'Failed to fetch students');
      }
    } catch (error) {
      handleError('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTeachers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/available-teachers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAvailableTeachers(data.teachers);
      } else {
        handleError(data.message || 'Failed to fetch teachers');
      }
    } catch (error) {
      handleError('Error fetching teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    
    // Ensure no more than 3 members (excluding the current user who is the leader)
    if (selectedOptions.length > 3) {
      handleError('You can select up to 3 team members (plus yourself as leader)');
      return;
    }
    
    setSelectedMembers(selectedOptions);
  };

  const handleTeacherSelect = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      handleError('Team name is required');
      return;
    }
    
    if (!problemStatement.trim()) {
      handleError('Problem statement is required');
      return;
    }
    
    if (selectedMembers.length === 0) {
      handleError('Please select at least one team member');
      return;
    }
    
    if (!selectedTeacher) {
      handleError('Please select a teacher');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/student/team/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          problemStatement,
          memberIds: selectedMembers,
          teacherId: selectedTeacher
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        handleSuccess('Team created successfully');
        
        // Reset form
        setName('');
        setProblemStatement('');
        setSelectedMembers([]);
        setSelectedTeacher('');
      } else {
        handleError(data.message || 'Failed to create team');
      }
    } catch (error) {
      handleError('Error creating team');
    } finally {
      setLoading(false);
    }
  };

  // Dark theme styles with purple and blue gradients
  const styles = {
    container: {
      backgroundColor: '#121212',
      borderRadius: '10px',
      padding: '30px',
      maxWidth: '800px',
      margin: '20px auto',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
      color: '#fff'
    },
    title: {
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '2.5rem',
      marginBottom: '20px',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      color: '#b39ddb',
      fontSize: '1.1rem',
      fontWeight: '500'
    },
    input: {
      backgroundColor: '#2d2d2d',
      border: '1px solid #444',
      borderRadius: '5px',
      padding: '12px 15px',
      color: '#e0e0e0',
      fontSize: '1rem',
      transition: 'border-color 0.3s',
      outline: 'none'
    },
    textarea: {
      backgroundColor: '#2d2d2d',
      border: '1px solid #444',
      borderRadius: '5px',
      padding: '12px 15px',
      color: '#e0e0e0',
      fontSize: '1rem',
      minHeight: '120px',
      transition: 'border-color 0.3s',
      outline: 'none',
      resize: 'vertical'
    },
    select: {
      backgroundColor: '#2d2d2d',
      border: '1px solid #444',
      borderRadius: '5px',
      padding: '12px 15px',
      color: '#e0e0e0',
      fontSize: '1rem',
      outline: 'none'
    },
    multiSelect: {
      backgroundColor: '#2d2d2d',
      border: '1px solid #444',
      borderRadius: '5px',
      padding: '12px 15px',
      color: '#e0e0e0',
      fontSize: '1rem',
      minHeight: '120px',
      outline: 'none'
    },
    option: {
      padding: '8px',
      backgroundColor: '#2d2d2d',
      color: '#e0e0e0'
    },
    helpText: {
      color: '#9e9e9e',
      fontSize: '0.85rem',
      marginTop: '5px'
    },
    button: {
      background: 'linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%)',
      border: 'none',
      borderRadius: '5px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      padding: '15px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      marginTop: '10px'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(142, 45, 226, 0.4)'
    },
    buttonDisabled: {
      background: '#666',
      cursor: 'not-allowed',
      opacity: '0.7'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create a New Team</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="teamName" style={styles.label}>Team Name:</label>
          <input
            type="text"
            id="teamName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#8e2de2'}
            onBlur={(e) => e.target.style.borderColor = '#444'}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="problemStatement" style={styles.label}>Problem Statement:</label>
          <textarea
            id="problemStatement"
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            required
            rows={5}
            style={styles.textarea}
            onFocus={(e) => e.target.style.borderColor = '#8e2de2'}
            onBlur={(e) => e.target.style.borderColor = '#444'}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="members" style={styles.label}>Select Team Members (max 3):</label>
          <select
            id="members"
            multiple
            value={selectedMembers}
            onChange={handleMemberSelect}
            required
            style={styles.multiSelect}
            onFocus={(e) => e.target.style.borderColor = '#8e2de2'}
            onBlur={(e) => e.target.style.borderColor = '#444'}
          >
            {availableStudents.map(student => (
              <option key={student._id} value={student._id} style={styles.option}>
                {student.name} ({student.email}) - Semester {student.semester}
              </option>
            ))}
          </select>
          <small style={styles.helpText}>Hold Ctrl (or Cmd) to select multiple members (up to 3)</small>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="teacher" style={styles.label}>Assigned Teacher:</label>
          <select
            id="teacher"
            value={selectedTeacher}
            onChange={handleTeacherSelect}
            required
            style={styles.select}
            onFocus={(e) => e.target.style.borderColor = '#8e2de2'}
            onBlur={(e) => e.target.style.borderColor = '#444'}
          >
            <option value="" style={styles.option}>-- Select a Teacher --</option>
            {availableTeachers.map(teacher => (
              <option key={teacher._id} value={teacher._id} style={styles.option}>
                {teacher.name} ({teacher.email})
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(142, 45, 226, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'none';
            e.target.style.boxShadow = 'none';
          }}
        >
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </form>
    </div>
  );
}

export default CreateTeam;