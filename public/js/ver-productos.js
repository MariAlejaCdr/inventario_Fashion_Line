$(document).ready(function() {
    $.ajax({
        url: '/productos',
        method: 'GET',
        success: function(data) {
            const tbody = $('#productosTableBody');
            tbody.empty();

            data.forEach(producto => {
                const row = $('<tr></tr>');

                // Verificar si la cantidad está en el umbral de stock
                if (producto.cantidad <= producto.umbral_stock) {
                    row.addClass('table-danger');
                }

                row.append(`<td>${producto.codigo}</td>`);
                row.append(`<td>${producto.nombre}</td>`);
                row.append(`<td>${producto.precio}</td>`);
                row.append(`<td>${producto.categoria}</td>`);
                row.append(`<td>${producto.cantidad}</td>`);
                row.append(`<td>${producto.talla}</td>`);
                row.append(`<td>${producto.proveedor}</td>`);
                row.append(`<td>${producto.umbral_stock}</td>`);

                tbody.append(row);
            });
        },
        error: function(err) {
            console.error('Error al obtener los productos:', err);
        }
    });
});