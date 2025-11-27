import { useState, useContext, useEffect } from 'react';
import { AppBar, IconButton, Toolbar, Typography, Menu, MenuItem, Container, Box, Snackbar, Alert } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '@/contexts/ThemeContext';
import Link from 'next/link';
import CameraIcon from '@mui/icons-material/Camera';
import { useRouter } from 'next/router';

export default function PersonalizedHeader({loggedIn}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ffv2_currentUser');
      setIsLogged(Boolean(raw));
    } catch (e) {
      setIsLogged(false);
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ffv2_currentUser');
    } catch (e) {
      console.error('Erro ao deslogar', e);
    }
    setIsLogged(false);
    setAnchorEl(null);
    setSnackbar({ open: true, message: 'Deslogado com sucesso', severity: 'success' });
    setTimeout(() => {
      router.replace('/login');
    }, 1200);
  };

  const { toggleTheme, themeMode } = useContext(ThemeContext);

  return (
    <>
    <AppBar 
      position="static" 
      sx={{ 
        minHeight: '8vh',
        backgroundColor: 'primary.main',
      }}>

      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: '8vh' }}>

        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
            <CameraIcon sx={{ mr: 1 }} fontSize='large' />
            FotoFácil
          </Typography>
        </Link>

        <Typography variant='h6' fontSize={{xs: 10, sm:20}} sx={{textAlign: 'center', fontStyle: 'italic', zIndex: 5}} >
          Crie, edite e compartilhe suas fotos com facilidade!
        </Typography>

        { isLogged ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '8rem'}}>

            <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
              {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            <Toolbar disableGutters>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"          
                aria-controls={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      sx: {
                        backgroundColor: 'background.paper',
                        color: 'secondary.main',
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <Link href="/projetos" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Meus projetos
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Sair</MenuItem>
                </Menu>
            </Toolbar>
          </Box>
          ) : (
            <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
              {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          )
        }
      </Container>
    </AppBar>
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
    </>
  )
}