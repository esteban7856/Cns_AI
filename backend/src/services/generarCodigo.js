function generarCodigo(longitud = 6) {
    const numeros = '0123456789';
    return Array.from({ length: longitud }, () => numeros.charAt(Math.floor(Math.random() * numeros.length))).join('');
  }
  
  module.exports = generarCodigo;
  