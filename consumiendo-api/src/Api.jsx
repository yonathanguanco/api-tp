

import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Api.css';

function ComponenteApi() {
  const [data, setData] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'completadas', 'incompletas'

  //GET
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos: ', error);
      });
  }, []);

  const alternarCompletadoTarea = (idTarea) => {
    const datosActualizados = data.map(item => {
      if (item.id === idTarea) {
        return {
          ...item,
          completado: !item.completado
        };
      }
      return item;
    });
    setData(datosActualizados);
  };

//POST
const agregarNuevaTarea = () => {
  if (nuevaTarea.trim() !== "") {
    const nuevaTareaObj = {
      userId: 1,
      id: data.length + 1,
      title: nuevaTarea,
      completado: false
    };
    axios.post('https://jsonplaceholder.typicode.com/todos', nuevaTareaObj)
      .then(response => {
        // Aquí podrías manejar la respuesta si es necesario
        console.log('Tarea agregada:', response.data);
        // Actualizamos el estado local solo si la solicitud es exitosa
        setData([...data, response.data]);
        setNuevaTarea("");
      })
      .catch(error => {
        console.error('Error al agregar la nueva tarea: ', error);
      });
  }
};

//DELETE
const eliminarTarea = (idTarea) => {
  axios.delete(`https://jsonplaceholder.typicode.com/todos/${idTarea}`)
    .then(response => {
      if (response.status === 200) {
        const datosActualizados = data.filter(item => item.id !== idTarea);
        setData(datosActualizados);
      } else {
        console.error('Error al eliminar la tarea.');
      }
    })
    .catch(error => {
      console.error('Error al eliminar la tarea: ', error);
    });
};
// PUT
const actualizarTarea = (idTarea, completado) => {
  axios.put(`https://jsonplaceholder.typicode.com/todos/${idTarea}`, { completado })
    .then(response => {
      const datosActualizados = data.map(item => {
        if (item.id === idTarea) {
          return {
            ...item,
            completado: response.data.completado
          };
        }
        return item;
      });
      setData(datosActualizados);
    })
    .catch(error => {
      console.error('Error al actualizar la tarea: ', error);
    });
};



  const datosFiltrados = data.filter(item => {
    if (filtro === 'todas') {
      return true;
    } else if (filtro === 'completadas') {
      return item.completado;
    } else {
      return !item.completado;
    }
  });

  return (
    <div className="app-container"> {}
      <div className="container"> {}
          <h2 className='app'>React</h2>
        <h2 className="my-4">Lista de Tareas</h2>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="Agregar nueva tarea"
          />
          <button className="btn btn-primary" onClick={agregarNuevaTarea}>Agregar</button>
        </div>
        <div className="btn-group mb-3" role="group">
          <button type="button" className={`btn ${filtro === 'todas' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFiltro('todas')}>Todas</button>
          <button type="button" className={`btn ${filtro === 'completadas' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFiltro('completadas')}>Completadas</button>
          <button type="button" className={`btn ${filtro === 'incompletas' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFiltro('incompletas')}>Incompletas</button>
        </div>
        {datosFiltrados.length > 0 ? (
          <ul className="list-group">
            {datosFiltrados.map(item => (
              <li key={item.id} className="list-group-item">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={item.completado}
                    onChange={() => alternarCompletadoTarea(item.id)}
                  />
                  <label className="form-check-label" style={{ textDecoration: item.completado ? 'line-through' : 'none' }}>
                    {item.title}
                  </label>
                  <button className="btn btn-danger btn-sm float-end" onClick={() => eliminarTarea(item.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay tareas que mostrar.</p>
        )}
      </div>
    </div>
  );
}

export default ComponenteApi;


