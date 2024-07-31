import React, { useState } from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import axios from 'axios';

const AddWaste = () => {
  const [wasteFile, setWasteFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('wasteFile', wasteFile);

    try {
      const response = await axios.post('http://92.112.193.8:5018/add-waste', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data);
    } catch (error) {
      console.error('Zayi dosyası yüklenirken hata oluştu:', error);
      alert('Zayi dosyası yüklenirken hata oluştu');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Zayi Ekle
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <input
              required
              type="file"
              id="waste-file"
              name="waste-file"
              onChange={(e) => setWasteFile(e.target.files[0])}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Ekle
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddWaste;