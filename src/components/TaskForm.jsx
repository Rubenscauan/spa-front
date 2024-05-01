import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, Typography, Container, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import axios from 'axios';

const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [duration, setDuration] = useState('');
  const [existingCategories, setExistingCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openDialog, setOpenDialog] = useState(false); 

  useEffect(() => {
    fetchExistingCategories();
  }, []);

  const fetchExistingCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categorias");
      const categoryTitles = response.data.map(category => category.title);
      setExistingCategories(categoryTitles);
    } catch (error) {
      console.error("Error fetching existing categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      "title": title,
      "description": description,
      "dateTime": dateTime,
      "duration": duration,
      "categoria":selectedCategory
    };
    console.log(newTask);
    try {
      await axios.post("http://localhost:8080/api/tasks", newTask);      
      alert('Nova tarefa adicionada com sucesso' + selectedCategory);
      clearForm();
    } catch (error) {
      alert('Erro ao processar a tarefa:', error);
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDateTime('');
    setDuration('');
    setSelectedCategory('');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitCategory = async () => {
    const newCategoria = {
      "title" : title
    };
    try {
      await axios.post("http://localhost:8080/api/categorias", newCategoria);
      alert("Categoria criada com sucesso");
      setTitle("");
      handleCloseDialog();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <Container style={{ maxWidth: '80%' }}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: "10"
      }}>
        <Typography >SPA DE GESTÃO DE TAREFAS</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Selecionar Categoria</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">Nenhuma</MenuItem>
                  {existingCategories.map((categoryTitle, index) => (
                    <MenuItem key={index} value={categoryTitle}>{categoryTitle}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Título"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Descrição"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data e Hora"
                type="datetime-local"
                variant="outlined"
                fullWidth
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duração (minutos)"
                type="number"
                variant="outlined"
                fullWidth
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
              <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px', marginTop: '15px' }}>
                Adicionar Tarefa
              </Button>
              <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginLeft: '10px', marginTop: '15px' }}>
                Cadastrar Categoria
              </Button>
            </Box>
          </Grid>
        </form>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cadastrar Nova Categoria</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome da Categoria"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmitCategory} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TaskForm;
