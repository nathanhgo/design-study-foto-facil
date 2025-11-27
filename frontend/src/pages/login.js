import { useState, useEffect, useRef } from 'react';
import PersonalizedHeader from '@/components/PersonalizedHeader';
import { Box, Grid, Paper, TextField, Button, Link, Typography, Snackbar, Alert } from '@mui/material';
import Polaroid from '@/components/Polaroid';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [polaroids, setPolaroids] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const router = useRouter();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const newPolaroids = [
      {
        id: 1,
        imageUrl: `/randomImages/04.jpg`,
        rotation: Math.random() * 15 - 10,
        sx: { top: '15%', left: '10%' },
      },
      {
        id: 2,
        imageUrl: `/randomImages/05.jpg`,
        rotation: Math.random() * 15 - 5,
        sx: { top: '40%', right: '5%' },
      },
      {
        id: 3,
        imageUrl: `/randomImages/06.jpg`,
        rotation: Math.random() * 20 - 10,
        sx: { bottom: '10%', left: '20%' },
      },
    ];
    setPolaroids(newPolaroids);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PersonalizedHeader loggedIn={false} />
      <Grid container component="main" sx={{ flexGrow: 1 }}>

        <Grid
          item
          size={6}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            display: { xs: 'none', md: 'block' },
            backgroundcolor: 'red'
          }}
        >
          {polaroids.map((p) => (
            <Polaroid key={p.id} {...p} />
          ))}
        </Grid>

        <Grid item size={{xs: 12, md: 6}} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              maxWidth: '400px',
              backgroundColor: 'background.paper',
              borderRadius: '12px',
            }}
          >
            <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 2 }}>
              Entrar na sua conta
            </Typography>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { color: 'text.primary' },
                '& label.Mui-focused': { color: 'text.primary' },
                '& .MuiInputLabel-root': { color: 'text.primary' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'text.primary' },
                  '&:hover fieldset': { borderColor: 'text.primary' },
                  '&.Mui-focused fieldset': { borderColor: 'text.primary' },
                },
              }}
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { color: 'text.primary' },
                '& label.Mui-focused': { color: 'text.primary' },
                '& .MuiInputLabel-root': { color: 'text.primary' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'text.primary' },
                  '&:hover fieldset': { borderColor: 'text.primary' },
                  '&.Mui-focused fieldset': { borderColor: 'text.primary' },
                },
              }}
            />
            <Button onClick={handleLogin} variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
              Entrar
            </Button>
            <Link href="/cadastrar" color="text.primary" sx={{ alignSelf: 'center', mt: 1 }}>
              Não tenho uma conta
            </Link>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );

  function handleLogin() {
    // simple localStorage-based auth
    if (!email || !password) {
      setSnackbar({ open: true, message: 'Preencha email e senha', severity: 'error' });
      return;
    }
    try {
      const raw = localStorage.getItem('ffv2_users');
      const users = raw ? JSON.parse(raw) : [];
      const found = users.find((u) => String(u.email) === String(email) && String(u.password) === String(password));
      if (found) {
        localStorage.setItem('ffv2_currentUser', JSON.stringify({ email: found.email }));
        setSnackbar({ open: true, message: 'Logado com sucesso', severity: 'success' });
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          router.push('/projetos');
        }, 2000);
      } else {
        setSnackbar({ open: true, message: 'Erro ao entrar: credenciais inválidas', severity: 'error' });
      }
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Erro ao logar', severity: 'error' });
    }
  }
}
