$(document).ready(function() {
    $('#searchInput').on('input', function() {
        const query = $(this).val();
        if (query.length > 0) {
            $.ajax({
                url: '/buscar',
                method: 'GET',
                data: { query: query },
                success: function(data) {
                    $('#searchResults').empty();
                    data.forEach(producto => {
                        $('#searchResults').append(`<div class="result-item" data-codigo="${producto.codigo}">${producto.nombre}</div>`);
                    });
                    $('.results-list').show();
                }
            });
        } else {
            $('#searchResults').empty();
            $('.results-list').hide();
        }
    });

    // Manejar la selección de un producto
    $(document).on('click', '.result-item', function() {
        const codigo = $(this).data('codigo');
        $.ajax({
            url: '/producto/' + codigo,
            method: 'GET',
            success: function(producto) {
                $('#codigo').val(producto.codigo);
                $('#nombre').val(producto.nombre);
                $('#categoria').val(producto.categoria);
                $('#precio').val(producto.precio);
                $('#cantidad').val(producto.cantidad);
                $('#talla').val(producto.talla);
                $('#proveedor').val(producto.proveedor);
                $('#umbral_stock').val(producto.umbral_stock);
                $('.results-list').hide();
            }
        });
    });

    // Manejar la actualización de un producto
    $('#actualizarBtn').on('click', function (e) {
        e.preventDefault();

        const nombre = $('#nombre').val();
        const productoData = {
            precio: parseFloat($('#precio').val()),
            categoria: $('#categoria').val(),
            cantidad: parseInt($('#cantidad').val()),
            talla: ($('#talla').val()),
            proveedor: $('#proveedor').val(),
            umbral_stock: parseInt($('#umbral_stock').val())
        };

        if (!nombre || !productoData.precio || !productoData.categoria || !productoData.cantidad || !productoData.talla || !productoData.proveedor || !productoData.umbral_stock) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        // Llamar a la función para actualizar el producto usando el nombre
        $.ajax({
            url: '/producto/nombre/' + encodeURIComponent(nombre),
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(productoData),
            success: function (producto) {
                alert('Producto actualizado con éxito: ' + producto.nombre);
            },
            error: function (err) {
                const errorMessage = err.responseJSON && err.responseJSON.message ? err.responseJSON.message : 'Error desconocido';
                alert('Error al actualizar el producto: ' + errorMessage);
            }
        });
    });
});

$(document).ready(function() {
    $('#eliminarBtn').click(function() {
        const codigo = $('#codigo').val();
        if (codigo) {
            $.ajax({
                url: `/producto/${codigo}`,
                type: 'DELETE',
                success: function(response) {
                    alert(response.message);
                },
                error: function(xhr) {
                    alert(xhr.responseJSON.message);
                }
            });
        } else {
            alert('Por favor, ingrese el código del producto a eliminar.');
        }
    });
});