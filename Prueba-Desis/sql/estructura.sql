CREATE TABLE bodegas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE sucursales (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  bodega_id INTEGER REFERENCES bodegas(id)
);

CREATE TABLE monedas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  bodega_id INTEGER REFERENCES bodegas(id),
  sucursal_id INTEGER REFERENCES sucursales(id),
  moneda_id INTEGER REFERENCES monedas(id),
  precio NUMERIC(10,2) NOT NULL,
  descripcion TEXT NOT NULL,
  materiales TEXT[] NOT NULL
);


