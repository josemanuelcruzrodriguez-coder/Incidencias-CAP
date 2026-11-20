namespace incidencias;

using {
    cuid,
    managed,
    sap.common.CodeList
} from '@sap/cds/common';

entity Incidencias : cuid, managed {
    numero        : Integer;
    titulo        : String(80) @mandatory;
    descripcion   : String(255);
    prioridad     : Association to Prioridades;
    estado        : Association to Estados;
    categoria     : Association to Categorias;
    tecnico       : Association to Tecnicos;
    fechaApertura : Date;
    fechaCierre   : Date;
    virtual criticidad : Integer;
    ubicacion     : String(60); 
    comentarios   : Composition of many Comentarios
                        on comentarios.incidencia = $self;
}

entity Comentarios : cuid, managed {
    incidencia : Association to Incidencias;
    texto      : String(500);
}

entity Tecnicos : cuid {
    nombre      : String(80);
    email       : String(120);
    incidencias : Association to many Incidencias
                      on incidencias.tecnico = $self;
}

entity Prioridades : CodeList {
    key code : String(1);
}

entity Estados : CodeList {
    key code : String(1);
}

entity Categorias : CodeList {
    key code : String(10);

}
