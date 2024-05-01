import React, { useState,useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid, Button,MenuItem,Select,InputLabel,FormControl, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import axios from 'axios';


const Task = ({ task }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editTaskDetails, setEditTaskDetails] = useState({
    title: task.title,
    description: task.description,
    dateTime: task.dateTime,
    duration: task.duration,
    categoria: task.categoria,
  });

  const [existingCategories, setExistingCategories] = useState([]);


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

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditTask = () => {
    console.log('Detalhes da tarefa editada:', editTaskDetails);
    axios.put('http://localhost:8080/api/tasks/' + task.id, editTaskDetails)
      .then(response => {
        console.log('Tarefa checada com sucesso:', response);
      })
      .catch(error => {
        console.error('Erro ao checar a tarefa:', error);
      });
    handleCloseEditDialog();
  };

  const deleteTask = (taskId) => {
    const isConfirmed = window.confirm('Tem certeza que deseja excluir esta tarefa?');
    if (isConfirmed) {
      axios.delete('http://localhost:8080/api/tasks/' + taskId)
        .then(response => {
          console.log('Tarefa deletada com sucesso:', response);
          window.location.reload();
        })
        .catch(error => {
          console.error('Erro ao deletar a tarefa:', error);
        });
    }
  };
  
  
  const checkTask = (task) => {
    const newTask = {
      "title": task.title,
      "description": task.description,
      "dateTime": task.dateTime,
      "duration": task.duration,
      "categoria": task.categoria,
      "checked": !task.checked
    }
    console.log(newTask);
      axios.put('http://localhost:8080/api/tasks/' + task.id, newTask)
        .then(response => {
          console.log('Tarefa checada com sucesso:', response);
          window.location.reload();

        })
        .catch(error => {
          console.error('Erro ao checar a tarefa:', error);
        });
  };
  

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', 
    }}>
      <Card style={{ backgroundColor: '#c8cfca', marginBottom: '5px', width: '400px' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box>
                <Typography variant="h5" component="h2" style={{ textDecoration: task.checked ? 'line-through' : 'none' }}>
                  {task.title}
                </Typography>
                <Typography color="textSecondary" style={{ textDecoration: task.checked ? 'line-through' : 'none' }}>
                  {task.dateTime}
                </Typography>
                <Typography variant="body2" component="p" style={{ textDecoration: task.checked ? 'line-through' : 'none' }}>
                  {task.description}
                </Typography>
                <Typography variant="body2" component="p" style={{ textDecoration: task.checked ? 'line-through' : 'none' }}>
                  Duração: {task.duration} minutos
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} container alignItems="center" justify="flex-end">
              <Typography variant="h5" component="h2" style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>
                {task.categoria}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box style={{display:'flex', marginLeft:'10px',flexDirection: "column",justifyContent: "center"}}> 
        <Button variant="contained" color="primary" onClick={() => deleteTask(task.id)}>Delete</Button>
        <Button variant="contained" color="primary" onClick={() => checkTask(task)} style={{marginTop:'10px'}}>Check</Button>
        <Button variant="contained" color="primary" style={{marginTop:'10px'}} onClick={handleOpenEditDialog}>Editar</Button>
      </Box>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Selecionar Categoria</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={editTaskDetails.categoria}
              style={{marginBottom: '20px'}}
              onChange={(e) => setEditTaskDetails({...editTaskDetails, categoria: e.target.value})}
            >
              <MenuItem value="">Nenhuma</MenuItem>
              {existingCategories.map((categoryTitle, index) => (
                <MenuItem key={index} value={categoryTitle}>{categoryTitle}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Título"
            variant="outlined"
            fullWidth
            value={editTaskDetails.title}
            style={{marginBottom: '20px'}}
            onChange={(e) => setEditTaskDetails({...editTaskDetails, title: e.target.value})}
          />
          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            value={editTaskDetails.description}
            style={{marginBottom: '20px'}}
            onChange={(e) => setEditTaskDetails({...editTaskDetails, description: e.target.value})}
          />
          <TextField
            label="Data e Hora"
            type="datetime-local"
            variant="outlined"
            fullWidth
            value={editTaskDetails.dateTime}
            style={{marginBottom: '20px'}}
            onChange={(e) => setEditTaskDetails({...editTaskDetails, dateTime: e.target.value})}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Duração (minutos)"
            type="number"
            variant="outlined"
            fullWidth
            value={editTaskDetails.duration}
            onChange={(e) => setEditTaskDetails({...editTaskDetails, duration: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleEditTask} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Task;
