import PersonalizedHeader from '@/components/PersonalizedHeader';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Container, Grid, Typography, Card, CardActionArea, CardMedia, CardContent, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const mockProjects = [
  {
    id: 1,
    name: 'Retrato de Verão',
    imageUrl: '/randomImages/01.jpg',
    lastEdited: '2 dias atrás',
  },
  {
    id: 2,
    name: 'Paisagem Urbana Noturna',
    imageUrl: '/randomImages/02.jpg',
    lastEdited: '5 dias atrás',
  },
  {
    id: 3,
    name: 'Ensaio de Produto',
    imageUrl: '/randomImages/03.jpg',
    lastEdited: '1 semana atrás',
  },
  {
    id: 4,
    name: 'Casamento na Praia',
    imageUrl: '/randomImages/04.jpg',
    lastEdited: '2 semanas atrás',
  },
  {
    id: 5,
    name: 'Festa de Aniversário',
    imageUrl: '/randomImages/05.jpg',
    lastEdited: '1 mês atrás',
  },
];

export default function ProjectsPage() {
  const STORAGE_KEY = 'ffv2_projects';
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : [];
      const currentRaw = localStorage.getItem('ffv2_currentUser');
      const currentUser = currentRaw ? JSON.parse(currentRaw) : null;
      if (currentUser && currentUser.email) {
        const userProjects = all.filter((p) => String(p.owner) === String(currentUser.email));
        setProjects(userProjects);
      } else {
        // not logged in -> block access and redirect to login
        router.replace('/login');
        return;
      }
    } catch (e) {
      console.error('Erro ao carregar projetos do localStorage', e);
      router.replace('/login');
    }
  }, []);

  const saveProjects = (nextUserProjects) => {
    setProjects(nextUserProjects);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : [];
      const currentRaw = localStorage.getItem('ffv2_currentUser');
      const currentUser = currentRaw ? JSON.parse(currentRaw) : null;

      // remove existing projects for current user from global list
      let merged = [];
      if (currentUser && currentUser.email) {
        merged = all.filter((p) => String(p.owner) !== String(currentUser.email));
        // add updated user's projects
        merged = [...nextUserProjects, ...merged];
      } else {
        // no logged user: treat these as guest projects (owner null)
        // remove any owner === null entries and replace with nextUserProjects
        merged = all.filter((p) => p.owner != null);
        merged = [...nextUserProjects, ...merged];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.error('Erro ao salvar projetos no localStorage', e);
    }
  };

  const handleDelete = (e, idToDelete) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      const currentRaw = localStorage.getItem('ffv2_currentUser');
      const currentUser = currentRaw ? JSON.parse(currentRaw) : null;

      // remove from UI list
      const next = projects.filter((p) => String(p.id) !== String(idToDelete));
      setProjects(next);

      // remove from stored global list only the project belonging to current user
      const raw = localStorage.getItem(STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : [];
      let filtered;
      if (currentUser && currentUser.email) {
        filtered = all.filter((p) => !(String(p.id) === String(idToDelete) && String(p.owner) === String(currentUser.email)));
      } else {
        filtered = all.filter((p) => !(String(p.id) === String(idToDelete) && (p.owner == null || p.owner === 'guest')));
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error('Erro ao deletar projeto', err);
    }
  };

  const handleCreateClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const id = Date.now().toString();
      const name = `Projeto ${id}`;
      const currentRaw = localStorage.getItem('ffv2_currentUser');
      const currentUser = currentRaw ? JSON.parse(currentRaw) : null;
      const owner = currentUser && currentUser.email ? currentUser.email : null;
      const newProject = {
        id,
        name,
        imageData: dataUrl,
        lastEdited: 'Agora',
        owner,
      };

      const next = [newProject, ...projects];
      // persist merged with other users
      saveProjects(next);
      router.push(`/editor?project=${id}`);
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PersonalizedHeader loggedIn={true} />
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Meus Projetos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            Criar novo projeto
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
        </Box>

        <Grid container spacing={4}>
          {projects.length === 0 ? (
            <Grid item xs={12} width={'100%'}>
              <Box sx={{ textAlign: 'center', py: 8, mt: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Sua lista de projetos está vazia, crie um agora mesmo!
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateClick}>
                  Criar agora
                </Button>
              </Box>
            </Grid>
          ) : (
            projects.map((project) => (
              <Grid item key={project.id} xs={12} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    position: 'relative',
                    backgroundColor: 'background.paper',
                    width: { xs: '70%', sm: '100%' },
                    display: 'flex',
                    margin: 'auto',
                    flexDirection: 'column',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => handleDelete(e, project.id)}
                    sx={{ position: 'absolute', top: 6, right: 6, zIndex: 2, bgcolor: 'rgba(255,255,255,0.8)', color: 'primary.main' }}
                    aria-label={`Excluir projeto ${project.name}`}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <CardActionArea href={`/editor?project=${project.id}`} component="a">
                    <CardMedia
                      component="img"
                      height="160"
                      image={project.imageData || project.imageUrl}
                      alt={`Imagem do projeto ${project.name}`}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div" noWrap>
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Última edição: {project.lastEdited}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}
