document.addEventListener('DOMContentLoaded', function () {
    const tbody      = document.querySelector('#loadCargoList tbody');
    const addBtn     = document.getElementById('addCargoBtn');
    const modal      = document.getElementById('cargoModal');
    const closeModal = document.getElementById('closeModal');
    const form       = document.getElementById('cargoForm');
    const title      = document.getElementById('modal-title');
    const apiUrl     = 'http://127.0.0.1:8000/catalogo/cargo/';

    // Campos del formulario
    const inpCodigo  = document.getElementById('codigo');
    const inpNombre  = document.getElementById('nombre');

    let editarId = null;

    // Cargar cargos
    function cargarCargos() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                tbody.innerHTML = '';
                data.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.setAttribute('data-id', item.ID_Cargo); // Guardamos el ID internamente

                    tr.innerHTML = `
                        <td>${item.Codigo}</td>
                        <td>${item.Nombre_cargo}</td>
                        <td>
                          <button class="btn-edit"><i class="bx bx-edit"></i></button>
                        </td>
                        <td>
                          <button class="btn-delete"><i class="bx bx-trash"></i></button>
                        </td>
                    `;

                    // Botones
                    tr.querySelector('.btn-edit').addEventListener('click', () => abrirModal(item));
                    tr.querySelector('.btn-delete').addEventListener('click', () => eliminarCargo(item.ID_Cargo));

                    tbody.appendChild(tr);
                });
            });
    }

    // Abrir modal
    function abrirModal(cargo = null) {
        editarId = cargo ? cargo.ID_Cargo : null;
        title.textContent = cargo ? 'Editar Cargo' : 'Agregar Cargo';

        inpCodigo.value = cargo?.Codigo || '';
        inpNombre.value = cargo?.Nombre_cargo || '';

        modal.style.display = 'flex';
    }

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Botón agregar
    addBtn.addEventListener('click', () => abrirModal());

    // Guardar cargo
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const payload = {
            Codigo: inpCodigo.value.trim(),
            Nombre_cargo: inpNombre.value.trim()
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
            cargarCargos();
        })
        .catch(err => {
            console.error(err);
            alert('Hubo un problema al guardar el cargo.');
        });
    });

    // Eliminar cargo
    function eliminarCargo(id) {
        if (!confirm('¿Seguro que deseas eliminar este cargo?')) return;
        fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar');
                cargarCargos();
            })
            .catch(err => {
                console.error(err);
                alert('No se pudo eliminar el cargo.');
            });
    }

    // Carga inicial
    cargarCargos();
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


