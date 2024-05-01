import React, { useState, useEffect } from 'react';
import Task from './Task';
import { TextField, Typography } from '@material-ui/core'; // Importe o TextField do Material-UI
import axios from 'axios';

const TaskList = () => {  
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State para armazenar o termo de pesquisa

  useEffect(() => {
    axios.get("http://localhost:8080/api/tasks")
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => alert(error));
  }, []);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{marginTop: '20px'}}>
      <Typography style={{ display: 'flex', justifyContent: 'center' }}>
        Lista de Tarefas - Pesquisar por nome:
        <TextField
          label="Pesquisar por nome"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: '10px', marginTop: '-10px' }}
        />
      </Typography>
      <ul style={{ listStyleType: 'none' }}>
        {filteredTasks.map(t => (
          <li key={t.id}>
            <Task task={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
