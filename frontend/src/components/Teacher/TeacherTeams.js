import React, { useState, useEffect } from 'react';
import { handleError } from '../../utils';

function TeacherTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dark theme with gradient styles
  const styles = {
    container: {
      backgroundColor: '#121212',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      background: 'linear-gradient(90deg, #a36fe7 0%, #5271ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center',
      fontSize: '2.5rem',
      marginBottom: '30px',
      padding: '10px 0',
    },
    teamsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '25px',
    },
    teamCard: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '25px', // Increased padding from 20px to 25px
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
      transition: 'transform 0.3s ease',
      border: '1px solid #333',
      position: 'relative',
      overflow: 'hidden',
    },
    teamCardHover: {
      transform: 'translateY(-5px)',
    },
    teamName: {
      background: 'linear-gradient(90deg, #c074fc 0%, #7592ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '1.6rem',
      marginBottom: '15px',
      borderBottom: '1px solid #333',
      paddingBottom: '12px',
    },
    sectionHeading: {
      background: 'linear-gradient(90deg, #a36fe7 30%, #5271ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '1.2rem',
      marginTop: '20px', // Increased from 15px
      marginBottom: '12px', // Increased from 8px
    },
    teamDetails: {
      margin: '15px 0', // Increased from 10px
    },
    semesterBadge: {
      background: 'linear-gradient(90deg, #6441a5 0%, #2a73cc 100%)',
      color: 'white',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      display: 'inline-block',
      fontWeight: 'bold',
    },
    problemStatement: {
      backgroundColor: '#252525',
      borderRadius: '8px',
      padding: '15px', // Increased from 12px
      margin: '20px 0', // Increased from 15px
      color: '#e0e0e0',
    },
    teamMembersContainer: {
      marginTop: '20px', // Increased from 15px
    },
    membersList: {
      listStyleType: 'none',
      padding: '0',
      margin: '0',
    },
    memberItem: {
      padding: '12px 0', // Increased from 8px
      borderBottom: '1px solid #333',
      marginBottom: '10px', // Added margin between members
    },
    memberName: {
      color: '#c293ff',
      fontWeight: 'bold',
    },
    memberEmail: {
      color: '#8aabff',
      marginLeft: '5px',
    },
    leaderTag: {
      background: 'linear-gradient(90deg, #9056ec 0%, #7fa0ff 100%)',
      color: 'white',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '0.8rem',
      marginLeft: '8px',
      fontWeight: 'bold',
    },
    teamDate: {
      color: '#888',
      fontSize: '0.9rem',
      marginTop: '20px', // Increased from 15px
      textAlign: 'right',
    },
    dateLabel: {
      color: '#aaa',
    },
    loading: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: '1.5rem',
      padding: '100px 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    noTeams: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: '1.5rem',
      padding: '100px 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/teacher/teams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTeams(data.teams);
      } else {
        handleError(data.message || 'Failed to fetch teams');
      }
    } catch (error) {
      handleError('Error fetching teams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading teams...</div>;
  }

  if (teams.length === 0) {
    return (
      <div style={styles.noTeams}>
        <p>No teams have been assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.teamsGrid}>
        {teams.map(team => (
          <div 
            key={team._id} 
            style={styles.teamCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={styles.teamName}>{team.name}</h3>
            <div style={styles.teamDetails}>
              <div>
                <span style={styles.semesterBadge}>Semester {team.semester}</span>
              </div>
              
              <div style={styles.problemStatement}>
                <h4 style={styles.sectionHeading}>Problem Statement:</h4>
                <p>{team.problemStatement}</p>
              </div>
              
              <div style={styles.teamMembersContainer}>
                <h4 style={styles.sectionHeading}>Team Members:</h4>
                <ul style={styles.membersList}>
                  {team.members.map(member => (
                    <li key={member._id} style={{...styles.memberItem, marginBottom: '15px'}}> {/* Increased space between members */}
                      <span style={styles.memberName}>{member.name}</span>
                      <span style={styles.memberEmail}>({member.email})</span>
                      {member._id === team.leader._id && 
                        <span style={styles.leaderTag}>Team Leader</span>
                      }
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={styles.teamDate}>
                <p>
                  <span style={styles.dateLabel}>Created: </span>
                  {new Date(team.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherTeams;