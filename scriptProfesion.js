document.addEventListener('DOMContentLoaded', function () {
    const tbody      = document.querySelector('#loadProfesionList tbody');
    const addBtn     = document.getElementById('addProBtn');
    const modal      = document.getElementById('ProfesionModal');
    const closeModal = document.getElementById('closeModal');
    const form       = document.getElementById('ProfesionForm');
    const title      = document.getElementById('modal-title');
    const apiUrl     = 'http://127.0.0.1:8000/catalogo/profesion/';

    // Campos del formulario
    const inpCodigo  = document.getElementById('codigo');
    const inpNombre  = document.getElementById('nombre');

    let editarId = null;

    // Cargar profesion
    function cargarProfesiones() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                tbody.innerHTML = '';
                data.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.setAttribute('data-id', item.ID_Profesion); 

                    tr.innerHTML = `
                        <td>${item.Codigo}</td>
                        <td>${item.Nombre_Profesion}</td>
                        <td>
                          <button class="btn-edit"><i class="bx bx-edit"></i></button>
                        </td>
                        <td>
                          <button class="btn-delete"><i class="bx bx-trash"></i></button>
                        </td>
                    `;

                    // Botones
                    tr.querySelector('.btn-edit').addEventListener('click', () => abrirModal(item));
                    tr.querySelector('.btn-delete').addEventListener('click', () => eliminarProfesion(item.ID_Profesion));

                    tbody.appendChild(tr);
                });
            });
    }

    // Abrir modal
    function abrirModal(profesion = null) {
        editarId = profesion ? profesion.ID_Profesion : null;
        title.textContent = profesion ? 'Editar Profesion' : 'Agregar Profesion';

        inpCodigo.value = profesion?.Codigo || '';
        inpNombre.value = profesion?.Nombre_Profesion || '';

        modal.style.display = 'flex';
    }

    // Cerrar profesion
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Botón agregar
    addBtn.addEventListener('click', () => abrirModal());

    // Guardar profesion
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const payload = {
            Codigo: inpCodigo.value.trim(),
            Nombre_Profesion: inpNombre.value.trim()
        };

        const url = editarId ? `${apiUrl}${editarId}/` : apiUrl;
        const method = editarId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) throw new Error('Error al guardar');
            modal.style.display = 'none';
            cargarProfesiones();
        })
        .catch(err => {
            console.error(err);
            alert('Hubo un problema al guardar la profesión.');
        });
    });

    // Eliminar profesion
    function eliminarProfesion(id) {
        if (!confirm('¿Seguro que deseas eliminar esta profesion?')) return;
        fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar');
                cargarProfesiones();
            })
            .catch(err => {
                console.error(err);
                alert('No se pudo eliminar la profesion.');
            });
    }

    // Carga inicial
    cargarProfesiones();
});

function toggleSubmenu(event) {
  event.preventDefault();
  const modulosItem = event.currentTarget.closest('.modulos-menu');
  modulosItem.classList.toggle('active');
}

// Cierra otros submenús si se hace clic fuera
document.addEventListener('click', function (e) {
  const clickedInside = e.target.closest('.modulos-menu');
  document.querySelectorAll('.modulos-menu').forEach(item => {
    if (item !== clickedInside) {
      item.classList.remove('active');
    }
  });
});