import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Employees = ({ managerId }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://92.112.193.81:5018/employees', {
          params: { managerId }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Çalışanlar yüklenirken hata oluştu:', error);
      }
    };

    fetchEmployees();
  }, [managerId]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Çalışanlar
      </Typography>
      <List>
        {employees.map(employee => (
          <ListItem key={employee.id}>
            <ListItemText primary={`${employee.first_name} ${employee.last_name}`} secondary={employee.role} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Employees;