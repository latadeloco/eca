/* Alteración de la tabla bancos para añadir IBAN, lo piden porque es imprescindible para el cobro */

ALTER TABLE banco ADD iban varchar(4);