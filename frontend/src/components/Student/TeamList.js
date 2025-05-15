import React, { useState, useEffect } from 'react';
import { handleError } from '../../utils';
// Removed CSS import as we're using inline styles

function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/student/team', {
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

  // Dark theme styles with purple and blue gradients
  const styles = {
    container: {
      backgroundColor: '#121212',
      borderRadius: '10px',
      padding: '30px',
      maxWidth: '1000px',
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
      marginBottom: '25px',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '1.2rem',
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    noTeams: {
      backgroundColor: '#121212',
      borderRadius: '10px',
      padding: '30px',
      maxWidth: '800px',
      margin: '20px auto',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
      color: '#9e9e9e',
      textAlign: 'center',
      fontSize: '1.2rem'
    },
    teamsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '25px'
    },
    teamCard: {
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      border: '1px solid #333',
      transition: 'transform 0.3s, box-shadow 0.3s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    teamCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 20px rgba(142, 45, 226, 0.3)'
    },
    teamName: {
      background: 'linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%)',
      color: 'white',
      padding: '15px 20px',
      margin: '0',
      fontSize: '1.4rem',
      fontWeight: 'bold',
      borderBottom: '1px solid #333'
    },
    teamDetails: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      flex: '1'
    },
    sectionTitle: {
      color: '#b39ddb',
      marginTop: '0',
      marginBottom: '8px',
      fontSize: '1.1rem',
      fontWeight: '500'
    },
    sectionContent: {
      color: '#e0e0e0',
      margin: '0',
      lineHeight: '1.5'
    },
    membersList: {
      margin: '5px 0 0 0',
      padding: '0 0 0 20px',
      color: '#e0e0e0'
    },
    memberItem: {
      margin: '5px 0',
      padding: '0'
    },
    memberLeader: {
      color: '#21d4fd',
      fontWeight: '500'
    },
    dateSection: {
      marginTop: 'auto',
      paddingTop: '10px',
      borderTop: '1px solid #333',
      color: '#9e9e9e',
      fontSize: '0.9rem'
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading teams...</div>;
  }

  if (teams.length === 0) {
    return (
      <div style={styles.noTeams}>
        <p>You haven't created or joined any teams yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Teams</h2>
      <div style={styles.teamsGrid}>
        {teams.map(team => (
          <div 
            key={team._id} 
            style={styles.teamCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(142, 45, 226, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
          >
            <h3 style={styles.teamName}>{team.name}</h3>
            <div style={styles.teamDetails}>
              <div>
                <h4 style={styles.sectionTitle}>Problem Statement:</h4>
                <p style={styles.sectionContent}>{team.problemStatement}</p>
              </div>
              
              <div>
                <h4 style={styles.sectionTitle}>Team Members:</h4>
                <ul style={styles.membersList}>
                  {team.members.map(member => (
                    <li key={member._id} style={styles.memberItem}>
                      {member._id === team.leader._id ? (
                        <span style={styles.memberLeader}>
                          {member.name} (Leader)
                        </span>
                      ) : (
                        member.name
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 style={styles.sectionTitle}>Assigned Teacher:</h4>
                <p style={styles.sectionContent}>{team.teacher.name}</p>
              </div>
              
              <div style={styles.dateSection}>
                <p style={styles.sectionContent}>
                  <strong>Created:</strong> {new Date(team.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamList;