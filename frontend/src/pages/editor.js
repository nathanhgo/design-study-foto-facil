import { useState, useEffect, useRef } from 'react';
import { Box, Menu, MenuItem, Button, Slider, Input, Typography, RadioGroup, FormControlLabel, Radio, Stack, Snackbar, Alert } from '@mui/material';
import PersonalizedHeader from '@/components/PersonalizedHeader';
import EditorSidebar from '@/components/EditorSidebar';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import CropIcon from '@mui/icons-material/CropRotate';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FaceIcon from '@mui/icons-material/Face';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SaveIcon from '@mui/icons-material/Save';

import { useRouter } from 'next/router';

const tools = [
  { name: 'Upload de Imagem', icon: <FileUploadIcon /> },
  { name: 'Recortar', icon: <CropIcon /> },
  { name: 'Filtros', icon: <AutoAwesomeIcon /> },
  { name: 'Detecção de Rosto', icon: <FaceIcon /> },
  { name: 'Edição em Massa', icon: <PhotoLibraryIcon /> },
  { name: 'Salvar', icon: <SaveIcon /> },
];

export default function EditorPage() {
  const router = useRouter();
  const { project } = router.query;

  const [imageSrc, setImageSrc] = useState(null);
  const [displaySrc, setDisplaySrc] = useState(null); // current visible image (can be filtered/cropped)
  const [originalSrc, setOriginalSrc] = useState(null);
  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, saturate: 100 });
  const [cropRatio, setCropRatio] = useState('free');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!router.isReady) return;
    try {
      const currentRaw = localStorage.getItem('ffv2_currentUser');
      const currentUser = currentRaw ? JSON.parse(currentRaw) : null;
      if (!currentUser || !currentUser.email) {
        router.replace('/login');
        return;
      }
    } catch (e) {
      router.replace('/login');
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!router.isReady) return;
    try {
      const raw = localStorage.getItem('ffv2_projects');
      if (raw) {
        const projects = JSON.parse(raw);
        const found = projects.find((p) => String(p.id) === String(project));
        if (found) {
          setImageSrc(found.imageData || found.imageUrl || null);
          setOriginalSrc(found.imageData || found.imageUrl || null);
          setDisplaySrc(found.imageData || found.imageUrl || null);
          return;
        }
      }
    } catch (e) {
      console.error('Erro ao carregar projeto do localStorage', e);
    }
    // fallback default
    setImageSrc(null);
  }, [project, router.isReady]);

  useEffect(() => {
    // whenever imageSrc changes, reset filters/crop
    setFilters({ brightness: 100, contrast: 100, saturate: 100 });
    setCropRatio('free');
    setDisplaySrc(imageSrc);
    setOriginalSrc(imageSrc);
  }, [imageSrc]);

  const [menuState, setMenuState] = useState({ anchorEl: null, toolName: null });

  const handleToolClick = (event, toolName) => {
    if (toolName === 'Salvar') {
      handleSave();
      return;
    }
    if (toolName === 'Upload de Imagem') {
      if (fileInputRef.current) fileInputRef.current.click();
      return;
    }
    setMenuState({
      anchorEl: event.currentTarget,
      toolName: toolName,
    });
  };

  const handleMenuClose = () => {
    setMenuState({ anchorEl: null, toolName: null });
  };

  const applyCrop = async () => {
    if (!originalSrc) return;
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = originalSrc;
      await img.decode();
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      let tw = iw, th = ih, sx = 0, sy = 0;

      if (cropRatio !== 'free') {
        const [wR, hR] = cropRatio.split('/').map(Number);
        const targetRatio = wR / hR;
        if (iw / ih > targetRatio) {
          th = ih;
          tw = Math.round(ih * targetRatio);
          sx = Math.round((iw - tw) / 2);
          sy = 0;
        } else {
          tw = iw;
          th = Math.round(iw / targetRatio);
          sy = Math.round((ih - th) / 2);
          sx = 0;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = tw;
      canvas.height = th;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sx, sy, tw, th, 0, 0, tw, th);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setDisplaySrc(dataUrl);
      setSnackbar({ open: true, message: 'Recorte aplicado', severity: 'success' });
      setMenuState({ anchorEl: null, toolName: null });
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Erro ao recortar', severity: 'error' });
    }
  };

  const applyFilters = async () => {
    if (!originalSrc) return;
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = originalSrc;
      await img.decode();
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = iw;
      canvas.height = ih;
      const ctx = canvas.getContext('2d');
      const f = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)`;
      if (ctx.filter !== undefined) ctx.filter = f;
      ctx.drawImage(img, 0, 0, iw, ih);
      if (ctx.filter !== undefined) ctx.filter = 'none';
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setDisplaySrc(dataUrl);
      setSnackbar({ open: true, message: 'Filtros aplicados', severity: 'success' });
      setMenuState({ anchorEl: null, toolName: null });
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Erro ao aplicar filtros', severity: 'error' });
    }
  };

  const handleSave = () => {
    try {
      const raw = localStorage.getItem('ffv2_projects');
      const all = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex((p) => String(p.id) === String(project));
      if (idx === -1) {
        setSnackbar({ open: true, message: 'Projeto não encontrado', severity: 'error' });
        return;
      }
      const updated = { ...all[idx], imageData: displaySrc || originalSrc, lastEdited: 'Agora' };
      all[idx] = updated;
      localStorage.setItem('ffv2_projects', JSON.stringify(all));
      // trigger download of the edited image
      try {
        const dataUrl = displaySrc || originalSrc;
        if (dataUrl) {
          const a = document.createElement('a');
          a.href = dataUrl;
          const safeName = (updated.name || `project-${updated.id}`).replace(/[^a-z0-9\-_\.]/gi, '_');
          a.download = `${safeName}.jpg`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      } catch (dlErr) {
        console.error('Erro ao iniciar download', dlErr);
      }

      setSnackbar({ open: true, message: 'Projeto salvo e imagem baixada', severity: 'success' });
      setMenuState({ anchorEl: null, toolName: null });
    } catch (e) {
      console.error('Erro ao salvar projeto', e);
      setSnackbar({ open: true, message: 'Erro ao salvar', severity: 'error' });
    }
  };

  const handleUploadFromSidebar = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setOriginalSrc(dataUrl);
      setDisplaySrc(dataUrl);
      setMenuState({ anchorEl: null, toolName: null });
    };
    reader.readAsDataURL(file);
  };

  return ( 
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <PersonalizedHeader loggedIn={true} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <EditorSidebar tools={tools} onToolClick={handleToolClick} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
            <Box 
              sx={{
                backgroundColor: 'secondary.main',
                p: 1,
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Box 
                component="img"
                src={displaySrc || imageSrc || `/randomImages/0${project || 1}.jpg`}
                alt="Imagem para edição"
                sx={{
                  display: 'block',
                  borderRadius: 1,
                  width: '100%',
                  height: '70vh',
                  objectFit: 'contain',
                  filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)`,
                }}
              />
            </Box>
        </Box>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e)=>handleUploadFromSidebar(e.target.files && e.target.files[0])} />
        <Menu
          anchorEl={menuState.anchorEl}
          open={Boolean(menuState.anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: {
                ml: 1.5, // Margem para não sobrepor o ícone
              },
            },
          }}
        >
          {(() => {
            const toolName = menuState.toolName;
            if (!toolName) return null;
            // Upload
            if (toolName === 'Upload de Imagem') {
              return (
                <MenuItem>
                  <Button component="label" fullWidth color='text.primary' onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                    Selecionar Arquivo
                  </Button>
                </MenuItem>
              );
            }
            // Recortar
            if (toolName === 'Recortar') {
              return (
                <Box sx={{ p: 2, width: 260 }}>
                  <Typography gutterBottom>Proporção</Typography>
                  <RadioGroup value={cropRatio} onChange={(e)=>setCropRatio(e.target.value)}>
                    <FormControlLabel value="free" control={<Radio />} label="Livre" />
                    <FormControlLabel value="1/1" control={<Radio />} label="1:1 (Quadrado)" />
                    <FormControlLabel value="4/3" control={<Radio />} label="4:3" />
                    <FormControlLabel value="16/9" control={<Radio />} label="16:9" />
                  </RadioGroup>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={applyCrop}>Aplicar Recorte</Button>
                    <Button variant="outlined" onClick={()=>{setDisplaySrc(originalSrc); setCropRatio('free');}}>Reset</Button>
                  </Stack>
                </Box>
              );
            }
            // Filtros
            if (toolName === 'Filtros') {
              return (
                <Box sx={{ p: 2, width: 260 }}>
                  <Typography gutterBottom>Filtros</Typography>
                  <Typography variant="caption">Brilho</Typography>
                  <Slider value={filters.brightness} onChange={(e,val)=>setFilters(f=>({...f,brightness:val}))} min={0} max={200} />
                  <Typography variant="caption">Contraste</Typography>
                  <Slider value={filters.contrast} onChange={(e,val)=>setFilters(f=>({...f,contrast:val}))} min={0} max={200} />
                  <Typography variant="caption">Saturação</Typography>
                  <Slider value={filters.saturate} onChange={(e,val)=>setFilters(f=>({...f,saturate:val}))} min={0} max={300} />
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={applyFilters}>Aplicar Filtros</Button>
                    <Button variant="outlined" onClick={()=>setFilters({ brightness: 100, contrast: 100, saturate: 100 })}>Reset</Button>
                  </Stack>
                </Box>
              );
            }
            // default fallback
            return <MenuItem>{toolName}</MenuItem>;
          })()}
        </Menu>
        <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={()=>setSnackbar(s=>({...s,open:false}))} anchorOrigin={{vertical:'bottom', horizontal:'left'}}>
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
