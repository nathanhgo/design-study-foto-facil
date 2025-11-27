import { useState, useEffect } from 'react';
import PersonalizedHeader from '../components/PersonalizedHeader';
import { Box, Button, Paper, Typography } from '@mui/material';
import Polaroid from '../components/Polaroid';

export default function Home() {
  const [polaroids, setPolaroids] = useState([]);

  useEffect(() => {
    const newPolaroids = [
      {
        id: 1,
        imageUrl: `/randomImages/01.jpg`,
        rotation: Math.random() * 15 - 10,
        sx: { top: { xs: '12vh', md: '15vh' }, left: { xs: '5%', md: '10%' } },
      },
      {
        id: 2,
        imageUrl: `/randomImages/02.jpg`,
        rotation: Math.random() * 15 - 5,
        sx: { top: { xs: '15vh', md: '20vh' }, right: { xs: '5%', md: '8%' } },
      },
      {
        id: 3,
        imageUrl: `/randomImages/03.jpg`,
        rotation: Math.random() * 20 - 10,
        sx: { bottom: { xs: '5vh', md: '10vh' }, left: { xs: '10%', md: '15%' } },
      },
      {
        id: 4,
        imageUrl: `/randomImages/04.jpg`,
        rotation: Math.random() * 20 - 5,
        sx: { bottom: { xs: '12vh', md: '15vh' }, right: { xs: '5%', md: '10%' } },      
      }
    ];
    setPolaroids(newPolaroids);
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <PersonalizedHeader loggedIn={false} />
      <Box 
        component="main" 
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>

        {polaroids.map((p) => (
          <Polaroid key={p.id} {...p} />
        ))}

        <Typography variant='h6' fontSize={{xs: 30, sm:40}} mb={2} sx={{textAlign: 'center', width:'400px', fontWeight: 'bold', zIndex: 5}} >
          Seja bem-vindo(a) ao FotoFácil!
        </Typography>
        <Typography variant='h6'  fontSize={20} mb={8} sx={{textAlign: 'center', fontWeight: 'light'}} >
          Sua solução para edição de imagens
        </Typography>

        <Paper elevation={2} sx={{ zIndex: 5, backgroundColor: 'background.paper', px: 4, py: 8, width: {xs:'80%', sm: '50%', md: '30%', lg: '25%', xl: '20%'}, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 3 }}>

          <Button variant="contained" color="primary" href="/login" >
            Entrar
          </Button>
          <Button variant="contained" color="primary" href="/cadastrar" >
            Cadastrar
          </Button>

        </Paper>
      </Box>
    </Box>
  );
}
